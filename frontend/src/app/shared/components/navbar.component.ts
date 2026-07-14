import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <nav
        class="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-white/[0.08] px-5"
        style="background: linear-gradient(135deg, rgba(20,18,26,0.85) 0%, rgba(12,11,16,0.9) 100%); backdrop-filter: blur(24px); box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);">

        <!-- Brand -->
        <a routerLink="/" class="group flex items-center gap-2.5">
         
          <img src="/assets/logo.png" alt="Logo" class="h-8 w-8 rounded-xl">
          <span class="font-display text-lg font-extrabold tracking-tight text-white">VisionCraft AI</span>
        </a>

        <!-- Desktop links -->
        <div class="hidden items-center gap-1 md:flex">
          @if (auth.isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="!text-white !bg-white/[0.08]" class="nav-link">Dashboard</a>
            <a routerLink="/generate" routerLinkActive="!text-white !bg-white/[0.08]" class="nav-link">Generate</a>
            <a routerLink="/history" routerLinkActive="!text-white !bg-white/[0.08]" class="nav-link">History</a>
            <a routerLink="/transactions" routerLinkActive="!text-white !bg-white/[0.08]" class="nav-link">Transactions</a>
          } @else {
            <a routerLink="/pricing" routerLinkActive="!text-white !bg-white/[0.08]" class="nav-link">Pricing</a>
          }
        </div>

        <!-- Right cluster -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="mobileOpen.set(!mobileOpen())"
            class="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white md:hidden"
            aria-label="Menu">
            @if (mobileOpen()) {
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
              </svg>
            }
          </button>

          @if (auth.isAuthenticated()) {
            <a
              routerLink="/pricing"
              class="hidden items-center gap-1.5 rounded-xl border border-gold-500/20 bg-gold-500/[0.06] px-3 py-1.5 text-sm font-semibold text-gold-400 transition-all hover:border-gold-500/30 hover:bg-gold-500/10 sm:inline-flex"
              title="Your credit balance"
              style="box-shadow: 0 0 15px -5px rgba(240, 160, 48, 0.2);">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor"><circle cx="12" cy="12" r="9" opacity="0.25"/><path d="M12 7v10M9 10h6"/></svg>
              {{ credits() }}
            </a>
            <a routerLink="/profile" class="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-300 transition hover:border-flame-500/30 hover:text-white sm:inline-flex" title="Profile">
              {{ initials() }}
            </a>
            <button type="button" (click)="auth.logout()" class="btn-ghost !py-1.5 !px-3 text-xs">Log out</button>
          } @else {
            <a routerLink="/login" class="btn-ghost !py-1.5 !px-3 text-xs">Log in</a>
            <a routerLink="/signup" class="btn-primary !py-1.5 !px-3 text-xs">Get started</a>
          }
        </div>
      </nav>

      @if (mobileOpen()) {
        <div
          class="mt-2 animate-slide-down rounded-2xl border border-white/[0.08] p-4 md:hidden"
          style="background: linear-gradient(135deg, rgba(14,12,20,0.97) 0%, rgba(7,6,10,0.98) 100%); backdrop-filter: blur(24px); box-shadow: 0 16px 48px rgba(0,0,0,0.5);">
          <div class="flex flex-col gap-1">
            @if (auth.isAuthenticated()) {
              <a routerLink="/dashboard" (click)="mobileOpen.set(false)" class="mobile-link">Dashboard</a>
              <a routerLink="/generate" (click)="mobileOpen.set(false)" class="mobile-link">Generate</a>
              <a routerLink="/history" (click)="mobileOpen.set(false)" class="mobile-link">History</a>
              <a routerLink="/transactions" (click)="mobileOpen.set(false)" class="mobile-link">Transactions</a>
              <a routerLink="/pricing" (click)="mobileOpen.set(false)" class="mobile-link">Buy Credits</a>
              <a routerLink="/profile" (click)="mobileOpen.set(false)" class="mobile-link">Profile</a>
            } @else {
              <a routerLink="/pricing" (click)="mobileOpen.set(false)" class="mobile-link">Pricing</a>
              <a routerLink="/login" (click)="mobileOpen.set(false)" class="mobile-link">Log in</a>
              <a routerLink="/signup" (click)="mobileOpen.set(false)" class="mobile-link">Sign up</a>
            }
          </div>
        </div>
      }
    </header>
    <div class="h-[72px]"></div>
  `,
  styles: [
    `
      .mobile-link {
        @apply rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-all;
      }
      .mobile-link:hover {
        @apply bg-white/[0.05] text-white;
      }
    `,
  ],
})
export class NavbarComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  mobileOpen = signal(false);

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
