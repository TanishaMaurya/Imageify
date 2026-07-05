import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../core/services/image.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { ImageCardComponent } from '../../shared/components/image-card.component';
import {
  AspectRatio,
  GeneratedImage,
  ImageStyle,
} from '../../core/models/image.model';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SpinnerComponent, ImageCardComponent],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header class="mb-8">
        <h1 class="font-display text-3xl font-bold">Generate an image</h1>
        <p class="mt-1 text-sm text-slate-500">
          One credit per image · {{ credits() }} credit{{ credits() === 1 ? '' : 's' }} left
        </p>
      </header>

      <div class="grid gap-8 lg:grid-cols-[420px_1fr]">
        <!-- Form -->
        <div class="card h-fit">
          @if (credits() < 1) {
            <div class="rounded-xl border border-amber-500/30 bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              You're out of credits. Buy more to keep generating.
              <a routerLink="/pricing" class="btn-primary mt-3 w-full py-2.5">Buy credits</a>
            </div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="generate()" class="space-y-5">
              <div>
                <label class="label" for="prompt">Prompt</label>
                <textarea
                  id="prompt"
                  formControlName="prompt"
                  rows="4"
                  class="input resize-none"
                  placeholder="A lighthouse on a cliff at golden hour, dramatic clouds…"></textarea>
                @if (invalid('prompt')) {
                  <p class="mt-1 text-xs text-red-500">Prompt must be at least 3 characters.</p>
                }
              </div>

              <div>
                <span class="label">Style</span>
                <div class="grid grid-cols-2 gap-2">
                  @for (s of styles; track s) {
                    <button
                      type="button"
                      (click)="form.controls.style.setValue(s)"
                      class="chip"
                      [class.chip-active]="form.controls.style.value === s">
                      {{ s }}
                    </button>
                  }
                </div>
              </div>

              <div>
                <span class="label">Aspect ratio</span>
                <div class="grid grid-cols-3 gap-2">
                  @for (r of ratios; track r) {
                    <button
                      type="button"
                      (click)="form.controls.aspectRatio.setValue(r)"
                      class="chip"
                      [class.chip-active]="form.controls.aspectRatio.value === r">
                      {{ r }}
                    </button>
                  }
                </div>
              </div>

              <button type="submit" class="btn-primary w-full py-3" [disabled]="loading()">
                @if (loading()) { <app-spinner /> Generating… } @else { Generate image }
              </button>
            </form>
          }
        </div>

        <!-- Preview -->
        <div class="flex min-h-[420px] items-center justify-center">
          @if (loading()) {
            <div class="w-full max-w-md text-center">
              <div class="skeleton mx-auto aspect-square w-full"></div>
              <p class="mt-4 text-sm text-slate-500">
                Rendering your image… the model may take a few seconds to warm up.
              </p>
            </div>
          } @else if (result()) {
            <div class="w-full max-w-md animate-develop">
              <app-image-card
                [image]="result()!"
                [showDelete]="false"
                (favorite)="onFavorite($event)" />
            </div>
          } @else {
            <div class="text-center text-slate-400">
              <div class="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 dark:bg-ink-800">
                <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke-linecap="round"/></svg>
              </div>
              <p class="text-sm">Your generated image will appear here.</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .chip {
        @apply rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:border-iris-500/50 dark:border-ink-600 dark:text-slate-300;
      }
      .chip-active {
        @apply border-iris-500 bg-iris-500/10 text-iris-500;
      }
    `,
  ],
})
export class GenerateComponent {
  private fb = inject(FormBuilder);
  private imageService = inject(ImageService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  styles: ImageStyle[] = ['Realistic', 'Anime', 'Digital Art', 'Sketch'];
  ratios: AspectRatio[] = ['1:1', '16:9', '9:16'];

  loading = signal(false);
  result = signal<GeneratedImage | null>(null);
  credits = computed(() => this.auth.credits());

  form = this.fb.nonNullable.group({
    prompt: ['', [Validators.required, Validators.minLength(3)]],
    style: this.fb.nonNullable.control<ImageStyle>('Realistic'),
    aspectRatio: this.fb.nonNullable.control<AspectRatio>('1:1'),
  });

  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  generate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.imageService.generate(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.result.set(res.data.image);
        this.auth.setCredits(res.data.credits); // sync balance in navbar
        this.toast.success('Image generated!');
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFavorite(image: GeneratedImage): void {
    this.imageService.toggleFavorite(image.id).subscribe({
      next: (res) => this.result.set(res.data.image),
    });
  }
}
