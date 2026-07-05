import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-slate-200 py-8 dark:border-ink-700">
      <div
        class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p class="text-sm text-slate-500">
          © {{ year }} Imageify. Images made with AI.
        </p>
        <div class="flex gap-4 text-sm text-slate-500">
          <a routerLink="/pricing" class="hover:text-iris-500">Pricing</a>
          <a routerLink="/login" class="hover:text-iris-500">Log in</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
