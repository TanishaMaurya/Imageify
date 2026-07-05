import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (totalPages > 1) {
      <nav class="flex items-center justify-center gap-2" aria-label="Pagination">
        <button
          type="button"
          class="btn-ghost !px-3"
          [disabled]="page <= 1"
          (click)="go(page - 1)">
          Prev
        </button>
        <span class="px-3 text-sm text-slate-500">
          Page {{ page }} of {{ totalPages }}
        </span>
        <button
          type="button"
          class="btn-ghost !px-3"
          [disabled]="page >= totalPages"
          (click)="go(page + 1)">
          Next
        </button>
      </nav>
    }
  `,
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  go(p: number): void {
    if (p >= 1 && p <= this.totalPages) this.pageChange.emit(p);
  }
}
