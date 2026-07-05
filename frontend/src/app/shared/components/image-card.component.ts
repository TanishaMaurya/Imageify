import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GeneratedImage } from '../../core/models/image.model';
import { ToastService } from '../../core/services/toast.service';

/**
 * Displays a single generated image with quick actions:
 * download, copy prompt, favorite toggle, delete.
 */
@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <figure
      class="group card animate-fade-in overflow-hidden !p-0 transition hover:shadow-glow">
      <div class="relative aspect-square overflow-hidden">
        <img
          [src]="image.imageUrl"
          [alt]="image.prompt"
          loading="lazy"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />

        <!-- Favorite badge -->
        <button
          type="button"
          (click)="favorite.emit(image)"
          class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          [attr.aria-pressed]="image.isFavorite"
          [attr.aria-label]="image.isFavorite ? 'Remove from favorites' : 'Add to favorites'">
          <svg viewBox="0 0 24 24" class="h-5 w-5" [attr.fill]="image.isFavorite ? '#F43F5E' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M12 21s-7-4.35-9.5-8.5C1 9 3 5.5 6.5 5.5c2 0 3.5 1.5 5.5 3.5 2-2 3.5-3.5 5.5-3.5C21 5.5 23 9 21.5 12.5 19 16.65 12 21 12 21z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Hover action bar -->
        <div
          class="absolute inset-x-0 bottom-0 flex translate-y-full items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 transition group-hover:translate-y-0">
          <button type="button" (click)="download()" class="pill" title="Download">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Download
          </button>
          <button type="button" (click)="copyPrompt()" class="pill" title="Copy prompt">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>
            Copy
          </button>
          @if (showDelete) {
            <button type="button" (click)="remove.emit(image)" class="pill ml-auto" title="Delete">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M9 7V4h6v3m-8 0l1 13h8l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          }
        </div>
      </div>

      <figcaption class="space-y-2 p-4">
        <p class="line-clamp-2 text-sm text-ink-700 dark:text-slate-300" [title]="image.prompt">
          {{ image.prompt }}
        </p>
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span class="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-ink-700">{{ image.style }}</span>
          <span class="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-ink-700">{{ image.aspectRatio }}</span>
          <span class="ml-auto">{{ image.createdAt | date: 'MMM d' }}</span>
        </div>
      </figcaption>
    </figure>
  `,
  styles: [
    `
      .pill {
        @apply inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-ink-900 backdrop-blur transition hover:bg-white;
      }
    `,
  ],
})
export class ImageCardComponent {
  @Input({ required: true }) image!: GeneratedImage;
  @Input() showDelete = true;
  @Output() favorite = new EventEmitter<GeneratedImage>();
  @Output() remove = new EventEmitter<GeneratedImage>();

  private toast = inject(ToastService);

  download(): void {
    const a = document.createElement('a');
    a.href = this.image.imageUrl;
    a.download = `imageify-${this.image.id}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async copyPrompt(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.image.prompt);
      this.toast.success('Prompt copied to clipboard.');
    } catch {
      this.toast.error('Could not copy the prompt.');
    }
  }
}
