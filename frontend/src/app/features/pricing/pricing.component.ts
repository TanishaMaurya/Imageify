import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { CreditPackage, OrderResult } from '../../core/models/payment.model';
import type {
  RazorpayHandlerResponse,
  RazorpayOptions,
} from '../../core/models/razorpay';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [SkeletonComponent, SpinnerComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header class="text-center">
        <h1 class="font-display text-4xl font-extrabold">Simple credit packs</h1>
        <p class="mx-auto mt-3 max-w-xl text-slate-500">
          One credit makes one image. Buy once, use anytime — no subscriptions.
        </p>
      </header>

      <div class="mt-12 grid gap-6 sm:grid-cols-3">
        @if (loading()) {
          @for (i of [1, 2, 3]; track i) {
            <div class="card space-y-4"><app-skeleton height="2rem" width="50%" /><app-skeleton height="3rem" /><app-skeleton height="2.5rem" /></div>
          }
        } @else {
          @for (pack of packages(); track pack.id; let idx = $index) {
            <div
              class="card relative flex flex-col"
              [class.ring-2]="idx === 1"
              [class.ring-iris-500]="idx === 1">
              @if (idx === 1) {
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-spectrum-gradient px-3 py-1 text-xs font-bold text-white shadow-glow">
                  Most popular
                </span>
              }
              <h3 class="font-display text-lg font-bold">{{ pack.label }}</h3>
              <p class="mt-4 font-display text-4xl font-extrabold">
                ₹{{ pack.amount }}
              </p>
              <p class="mt-1 text-sm text-slate-500">{{ pack.credits }} credits</p>
              <p class="mt-1 text-xs text-slate-400">
                ≈ ₹{{ (pack.amount / pack.credits).toFixed(2) }} per image
              </p>
              <button
                type="button"
                class="mt-6 w-full py-3"
                [class]="idx === 1 ? 'btn-primary' : 'btn-ghost'"
                [disabled]="buying() === pack.id"
                (click)="buy(pack)">
                @if (buying() === pack.id) { <app-spinner /> Processing… } @else { Buy {{ pack.credits }} credits }
              </button>
            </div>
          }
        }
      </div>

      @if (!auth.isAuthenticated()) {
        <p class="mt-8 text-center text-sm text-slate-500">
          You'll need to log in before purchasing.
        </p>
      }
    </section>
  `,
})
export class PricingComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private toast = inject(ToastService);
  private router = inject(Router);
  auth = inject(AuthService);

  packages = signal<CreditPackage[]>([]);
  loading = signal(true);
  buying = signal<string | null>(null);

  ngOnInit(): void {
    this.paymentService.packages().subscribe({
      next: (res) => {
        this.packages.set(res.data.packages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  buy(pack: CreditPackage): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { redirect: '/pricing' } });
      return;
    }
    if (!window.Razorpay) {
      this.toast.error('Payment library failed to load. Please refresh and try again.');
      return;
    }

    this.buying.set(pack.id);
    // 1. Create an order on the backend.
    this.paymentService.createOrder(pack.id).subscribe({
      next: (res) => this.openCheckout(res.data),
      error: () => this.buying.set(null),
    });
  }

  /** 2. Open Razorpay Checkout, then 3. verify the payment server-side. */
  private openCheckout(order: OrderResult): void {
    const user = this.auth.user();
    const options: RazorpayOptions = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Imageify',
      description: `${order.credits} credits — ${order.packageLabel}`,
      order_id: order.orderId,
      prefill: { name: user?.name, email: user?.email },
      theme: { color: '#7C6CFF' },
      handler: (response: RazorpayHandlerResponse) => this.verify(response),
      modal: {
        ondismiss: () => {
          this.buying.set(null);
          this.toast.info('Payment cancelled.');
        },
      },
    };
    new window.Razorpay(options).open();
  }

  private verify(response: RazorpayHandlerResponse): void {
    this.paymentService.verify(response).subscribe({
      next: (res) => {
        this.auth.setCredits(res.data.credits);
        this.toast.success('Payment successful — credits added!');
        this.buying.set(null);
        this.router.navigate(['/dashboard']);
      },
      error: () => this.buying.set(null),
    });
  }
}
