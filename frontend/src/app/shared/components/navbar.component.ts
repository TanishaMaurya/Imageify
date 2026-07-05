import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-ink-700 dark:bg-ink-900/80">
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <!-- Brand -->
        <a routerLink="/" class="group flex items-center gap-2">
          <span
            class="grid h-8 w-8 place-items-center rounded-lg bg-spectrum-gradient text-white shadow-glow">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 16l4-5 3 3 4-6 5 8" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="8" cy="7" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span class="font-display text-lg font-extrabold tracking-tight">Imageify</span>
        </a>

        <!-- Links -->
        <div class="hidden items-center gap-1 md:flex">
          @if (auth.isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="text-iris-500" class="nav-link">Dashboard</a>
            <a routerLink="/generate" routerLinkActive="text-iris-500" class="nav-link">Generate</a>
            <a routerLink="/history" routerLinkActive="text-iris-500" class="nav-link">History</a>
            <a routerLink="/transactions" routerLinkActive="text-iris-500" class="nav-link">Transactions</a>
          } @else {
            <a routerLink="/pricing" routerLinkActive="text-iris-500" class="nav-link">Pricing</a>
          }
        </div>

        <!-- Right cluster -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="theme.toggle()"
            [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            class="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-ink-800">
            @if (theme.theme() === 'dark') {
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke-linecap="round" />
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            }
          </button>

          @if (auth.isAuthenticated()) {
            <a
              routerLink="/pricing"
              class="hidden items-center gap-1.5 rounded-lg border border-iris-500/30 bg-iris-500/10 px-3 py-1.5 text-sm font-semibold text-iris-500 sm:inline-flex"
              title="Your credit balance">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor"><circle cx="12" cy="12" r="9" opacity="0.25"/><path d="M12 7v10M9 10h6"/></svg>
              {{ credits() }}
            </a>
            <a routerLink="/profile" class="btn-ghost hidden sm:inline-flex" title="Profile">
              {{ initials() }}
            </a>
            <button type="button" (click)="auth.logout()" class="btn-ghost">Log out</button>
          } @else {
            <a routerLink="/login" class="btn-ghost">Log in</a>
            <a routerLink="/signup" class="btn-primary">Get started</a>
          }
        </div>
      </nav>
    </header>
  `,
  styles: [
    `
      .nav-link {
        @apply rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition hover:text-iris-500 dark:text-slate-300;
      }
    `,
  ],
})
export class NavbarComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);

  credits = computed(() => this.auth.credits());
  initials = computed(() => {
    const name = this.auth.user()?.name ?? '';
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });
}
