import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ImageService } from '../../core/services/image.service';
import { ToastService } from '../../core/services/toast.service';
import { ImageCardComponent } from '../../shared/components/image-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { GeneratedImage } from '../../core/models/image.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ImageCardComponent,
    SkeletonComponent,
    PaginationComponent,
  ],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header class="mb-6">
        <h1 class="font-display text-3xl font-bold">Your gallery</h1>
        <p class="mt-1 text-sm text-slate-500">Search, favorite, download, or remove your images.</p>
      </header>

      <!-- Controls -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative flex-1">
          <svg viewBox="0 0 24 24" class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4" stroke-linecap="round"/></svg>
          <input [formControl]="search" type="search" class="input pl-10" placeholder="Search prompts…" />
        </div>
        <button
          type="button"
          (click)="toggleFavorites()"
          class="btn-ghost"
          [class.!border-iris-500]="favoritesOnly()"
          [class.!text-iris-500]="favoritesOnly()">
          <svg viewBox="0 0 24 24" class="h-4 w-4" [attr.fill]="favoritesOnly() ? '#F43F5E' : 'none'" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.35-9.5-8.5C1 9 3 5.5 6.5 5.5c2 0 3.5 1.5 5.5 3.5 2-2 3.5-3.5 5.5-3.5C21 5.5 23 9 21.5 12.5 19 16.65 12 21 12 21z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Favorites
        </button>
      </div>

      <!-- Grid -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @if (loading()) {
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="card !p-0"><app-skeleton height="240px" /><div class="space-y-2 p-4"><app-skeleton height="0.9rem" /><app-skeleton height="0.9rem" width="60%" /></div></div>
          }
        } @else if (images().length) {
          @for (img of images(); track img.id) {
            <app-image-card [image]="img" (favorite)="onFavorite($event)" (remove)="onRemove($event)" />
          }
        } @else {
          <div class="card col-span-full py-16 text-center text-slate-400">
            <p>{{ search.value ? 'No images match your search.' : 'No images yet.' }}</p>
            @if (!search.value) {
              <a routerLink="/generate" class="btn-primary mt-4 px-5 py-2.5">Generate your first image</a>
            }
          </div>
        }
      </div>

      <div class="mt-8">
        <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="goTo($event)" />
      </div>
    </section>
  `,
})
export class HistoryComponent implements OnInit {
  private imageService = inject(ImageService);
  private toast = inject(ToastService);

  search = new FormControl('', { nonNullable: true });
  images = signal<GeneratedImage[]>([]);
  loading = signal(true);
  page = signal(1);
  totalPages = signal(1);
  favoritesOnly = signal(false);

  ngOnInit(): void {
    this.load();
    this.search.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.page.set(1);
        this.load();
      });
  }

  private load(): void {
    this.loading.set(true);
    this.imageService
      .history({
        page: this.page(),
        limit: 12,
        search: this.search.value,
        favorites: this.favoritesOnly(),
      })
      .subscribe({
        next: (res) => {
          this.images.set(res.data.items);
          this.totalPages.set(res.data.pagination.totalPages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  toggleFavorites(): void {
    this.favoritesOnly.update((v) => !v);
    this.page.set(1);
    this.load();
  }

  goTo(p: number): void {
    this.page.set(p);
    this.load();
  }

  onFavorite(image: GeneratedImage): void {
    this.imageService.toggleFavorite(image.id).subscribe({
      next: (res) => {
        // If viewing favorites-only and it was un-favorited, drop it.
        if (this.favoritesOnly() && !res.data.image.isFavorite) {
          this.images.update((list) => list.filter((i) => i.id !== image.id));
        } else {
          this.images.update((list) =>
            list.map((i) => (i.id === image.id ? res.data.image : i))
          );
        }
      },
    });
  }

  onRemove(image: GeneratedImage): void {
    this.imageService.remove(image.id).subscribe({
      next: () => {
        this.images.update((list) => list.filter((i) => i.id !== image.id));
        this.toast.success('Image deleted.');
      },
    });
  }
}
