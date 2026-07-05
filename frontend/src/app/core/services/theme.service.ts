import { Injectable, effect, signal } from '@angular/core';

type Theme = 'light' | 'dark';
const THEME_KEY = 'imageify_theme';

/**
 * Dark/light mode via the `dark` class on <html>, persisted to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initial());

  constructor() {
    // Keep the DOM + storage in sync whenever the signal changes.
    effect(() => {
      const t = this.theme();
      const root = document.documentElement;
      root.classList.toggle('dark', t === 'dark');
      localStorage.setItem(THEME_KEY, t);
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private initial(): Theme {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
