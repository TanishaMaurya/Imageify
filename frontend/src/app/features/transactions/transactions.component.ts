import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { Transaction } from '../../core/models/payment.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [DatePipe, RouterLink, SkeletonComponent, PaginationComponent],
  template: `
    <section class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="font-display text-3xl font-bold">Transactions</h1>
          <p class="mt-1 text-sm text-slate-500">Your credit purchase history.</p>
        </div>
        <a routerLink="/pricing" class="btn-primary px-4 py-2.5">Buy credits</a>
      </header>

      <div class="card overflow-hidden !p-0">
        @if (loading()) {
          <div class="space-y-3 p-6">
            <app-skeleton height="1.4rem" /><app-skeleton height="1.4rem" /><app-skeleton height="1.4rem" />
          </div>
        } @else if (txns().length) {
          <table class="w-full text-sm">
            <thead class="border-b border-slate-200 text-left text-slate-500 dark:border-ink-700">
              <tr>
                <th class="p-4 font-medium">Date</th>
                <th class="p-4 font-medium">Order ID</th>
                <th class="p-4 font-medium">Amount</th>
                <th class="p-4 font-medium">Credits</th>
                <th class="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (t of txns(); track t.id) {
                <tr class="border-b border-slate-100 last:border-0 dark:border-ink-700/50">
                  <td class="p-4 whitespace-nowrap">{{ t.createdAt | date: 'MMM d, y, h:mm a' }}</td>
                  <td class="p-4 font-mono text-xs text-slate-400">{{ t.orderId }}</td>
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
          <div class="py-16 text-center text-slate-400">
            <p>No transactions yet.</p>
            <a routerLink="/pricing" class="btn-primary mt-4 px-5 py-2.5">Buy your first credit pack</a>
          </div>
        }
      </div>

      <div class="mt-8">
        <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="goTo($event)" />
      </div>
    </section>
  `,
})
export class TransactionsComponent implements OnInit {
  private paymentService = inject(PaymentService);

  txns = signal<Transaction[]>([]);
  loading = signal(true);
  page = signal(1);
  totalPages = signal(1);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.paymentService.transactions(this.page(), 10).subscribe({
      next: (res) => {
        this.txns.set(res.data.items);
        this.totalPages.set(res.data.pagination.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  goTo(p: number): void {
    this.page.set(p);
    this.load();
  }

  statusClass(status: string): string {
    if (status === 'SUCCESS')
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';
    if (status === 'FAILED')
      return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
  }
}
