import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ImageService } from '../../core/services/image.service';
import { PaymentService } from '../../core/services/payment.service';
import { ImageCardComponent } from '../../shared/components/image-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { GeneratedImage } from '../../core/models/image.model';
import { Transaction } from '../../core/models/payment.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, ImageCardComponent, SkeletonComponent, DatePipe],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <!-- Welcome -->
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="font-display text-3xl font-bold">
            Welcome back, {{ auth.user()?.name }} 👋
          </h1>
          <p class="mt-1 text-sm text-slate-500">Here's what's happening in your studio.</p>
        </div>
        <a routerLink="/generate" class="btn-primary px-5 py-3">Generate new image</a>
      </div>

      <!-- Stat cards -->
      <div class="mt-8 grid gap-4 sm:grid-cols-3">
        <div class="card relative overflow-hidden">
          <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-spectrum-gradient opacity-20 blur-2xl"></div>
          <p class="text-sm text-slate-500">Credit balance</p>
          <p class="mt-2 font-display text-4xl font-extrabold">{{ credits() }}</p>
          @if (credits() < 1) {
            <a routerLink="/pricing" class="btn-primary mt-3 w-full py-2">Buy credits</a>
          } @else {
            <a routerLink="/pricing" class="mt-3 inline-block text-sm font-semibold text-iris-500 hover:underline">Top up →</a>
          }
        </div>
        <div class="card">
          <p class="text-sm text-slate-500">Images created</p>
          <p class="mt-2 font-display text-4xl font-extrabold">{{ totalImages() }}</p>
          <a routerLink="/history" class="mt-3 inline-block text-sm font-semibold text-iris-500 hover:underline">View gallery →</a>
        </div>
        <div class="card">
          <p class="text-sm text-slate-500">Purchases</p>
          <p class="mt-2 font-display text-4xl font-extrabold">{{ totalPurchases() }}</p>
          <a routerLink="/transactions" class="mt-3 inline-block text-sm font-semibold text-iris-500 hover:underline">View transactions →</a>
        </div>
      </div>

      <!-- Recent images -->
      <div class="mt-12 flex items-center justify-between">
        <h2 class="font-display text-xl font-bold">Recent images</h2>
        <a routerLink="/history" class="text-sm font-semibold text-iris-500 hover:underline">See all</a>
      </div>

      <div class="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @if (loadingImages()) {
          @for (i of [1, 2, 3]; track i) {
            <div class="card !p-0">
              <app-skeleton height="240px" />
              <div class="space-y-2 p-4">
                <app-skeleton height="0.9rem" />
                <app-skeleton height="0.9rem" width="60%" />
              </div>
            </div>
          }
        } @else if (recent().length) {
          @for (img of recent(); track img.id) {
            <app-image-card [image]="img" (favorite)="onFavorite($event)" (remove)="onRemove($event)" />
          }
        } @else {
          <div class="card col-span-full text-center text-slate-400">
            <p>No images yet. <a routerLink="/generate" class="font-semibold text-iris-500 hover:underline">Generate your first one.</a></p>
          </div>
        }
      </div>

      <!-- Recent transactions -->
      <h2 class="mt-12 font-display text-xl font-bold">Recent transactions</h2>
      <div class="mt-4 card overflow-hidden !p-0">
        @if (loadingTxns()) {
          <div class="space-y-3 p-6">
            <app-skeleton height="1.2rem" /><app-skeleton height="1.2rem" />
          </div>
        } @else if (txns().length) {
          <table class="w-full text-sm">
            <thead class="border-b border-slate-200 text-left text-slate-500 dark:border-ink-700">
              <tr>
                <th class="p-4 font-medium">Date</th>
                <th class="p-4 font-medium">Amount</th>
                <th class="p-4 font-medium">Credits</th>
                <th class="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (t of txns(); track t.id) {
                <tr class="border-b border-slate-100 last:border-0 dark:border-ink-700/50">
                  <td class="p-4">{{ t.createdAt | date: 'MMM d, y' }}</td>
                  <td class="p-4">₹{{ t.amount }}</td>
                  <td class="p-4">+{{ t.creditsAdded }}</td>
                  <td class="p-4">
                    <span class="rounded-full px-2 py-0.5 text-xs font-semibold" [class]="statusClass(t.status)">{{ t.status }}</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <p class="p-6 text-center text-sm text-slate-400">No purchases yet.</p>
        }
      </div>
    </section>
  `,
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private imageService = inject(ImageService);
  private paymentService = inject(PaymentService);

  credits = computed(() => this.auth.credits());
  recent = signal<GeneratedImage[]>([]);
  txns = signal<Transaction[]>([]);
  totalImages = signal(0);
  totalPurchases = signal(0);
  loadingImages = signal(true);
  loadingTxns = signal(true);

  ngOnInit(): void {
    // Keep the credit balance authoritative on load.
    this.auth.refreshUser().subscribe();

    this.imageService.history({ page: 1, limit: 3 }).subscribe({
      next: (res) => {
        this.recent.set(res.data.items);
        this.totalImages.set(res.data.pagination.total);
        this.loadingImages.set(false);
      },
      error: () => this.loadingImages.set(false),
    });

    this.paymentService.transactions(1, 5).subscribe({
      next: (res) => {
        this.txns.set(res.data.items);
        this.totalPurchases.set(res.data.pagination.total);
        this.loadingTxns.set(false);
      },
      error: () => this.loadingTxns.set(false),
    });
  }

  onFavorite(image: GeneratedImage): void {
    this.imageService.toggleFavorite(image.id).subscribe({
      next: (res) =>
        this.recent.update((list) => list.map((i) => (i.id === image.id ? res.data.image : i))),
    });
  }

  onRemove(image: GeneratedImage): void {
    this.imageService.remove(image.id).subscribe({
      next: () => this.recent.update((list) => list.filter((i) => i.id !== image.id)),
    });
  }

  statusClass(status: string): string {
    if (status === 'SUCCESS')
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';
    if (status === 'FAILED')
      return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
  }
}
