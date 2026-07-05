import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <span
      class="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
      [style.width.px]="size"
      [style.height.px]="size"
      role="status"
      aria-label="Loading"></span>
  `,
})
export class SpinnerComponent {
  @Input() size = 18;
}
