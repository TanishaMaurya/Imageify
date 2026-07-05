import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div
      class="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
      @for (t of toast.toasts(); track t.id) {
        <div
          class="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-xl border p-3.5 shadow-lg backdrop-blur"
          [class]="styles(t.type)"
          role="alert">
          <span class="mt-0.5 shrink-0">
            @switch (t.type) {
              @case ('success') {
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
              }
              @default {
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1" stroke-linecap="round"/></svg>
              }
            }
          </span>
          <p class="flex-1 text-sm font-medium">{{ t.message }}</p>
          <button
            type="button"
            (click)="toast.dismiss(t.id)"
            class="shrink-0 opacity-60 hover:opacity-100"
            aria-label="Dismiss">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  toast = inject(ToastService);

  styles(type: string): string {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300';
      case 'error':
        return 'border-red-500/30 bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-300';
      default:
        return 'border-iris-500/30 bg-iris-500/10 text-iris-600 dark:text-iris-400';
    }
  }
}
