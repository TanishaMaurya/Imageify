import { Component, Input } from '@angular/core';

/** Simple shimmer placeholder block. */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `<div class="skeleton" [style.height]="height" [style.width]="width"></div>`,
})
export class SkeletonComponent {
  @Input() height = '1rem';
  @Input() width = '100%';
}
