import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <!-- Ambient spectrum glow -->
      <div
        class="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-spectrum-gradient opacity-20 blur-[120px]"
        aria-hidden="true"></div>

      <div class="relative mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-iris-500/30 bg-iris-500/10 px-3 py-1 text-xs font-semibold text-iris-500">
          <span class="h-1.5 w-1.5 rounded-full bg-spectrum-cyan"></span>
          10 free credits when you sign up
        </span>

        <h1
          class="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          Turn words into
          <span
            class="bg-spectrum-gradient bg-clip-text text-transparent">images</span>
          in seconds.
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
          Describe anything. Pick a style and shape. Imageify renders it with AI —
          then keep, download, and revisit your whole gallery.
        </p>

        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          @if (auth.isAuthenticated()) {
            <a routerLink="/generate" class="btn-primary px-6 py-3 text-base">Start generating</a>
            <a routerLink="/dashboard" class="btn-ghost px-6 py-3 text-base">Go to dashboard</a>
          } @else {
            <a routerLink="/signup" class="btn-primary px-6 py-3 text-base">Create free account</a>
            <a routerLink="/pricing" class="btn-ghost px-6 py-3 text-base">See pricing</a>
          }
        </div>
      </div>
    </section>

    <!-- Feature strip -->
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-3">
        @for (f of features; track f.title) {
          <div class="card animate-fade-up">
            <div class="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-iris-500/10 text-iris-500">
              <div [innerHTML]="f.icon"></div>
            </div>
            <h3 class="font-display text-lg font-bold">{{ f.title }}</h3>
            <p class="mt-2 text-sm text-slate-500">{{ f.body }}</p>
          </div>
        }
      </div>
    </section>

    <!-- Steps -->
    <section class="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <h2 class="text-center font-display text-3xl font-bold">Three steps to your image</h2>
      <div class="mt-10 grid gap-8 sm:grid-cols-3">
        @for (s of steps; track s.n) {
          <div class="text-center">
            <span
              class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-spectrum-gradient font-display text-lg font-bold text-white shadow-glow">
              {{ s.n }}
            </span>
            <h3 class="mt-4 font-semibold">{{ s.title }}</h3>
            <p class="mt-1 text-sm text-slate-500">{{ s.body }}</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class HomeComponent {
  auth = inject(AuthService);

  features = [
    {
      title: 'Four distinct styles',
      body: 'Realistic, anime, digital art, or sketch — each tuned with its own prompt recipe.',
      icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l4-5 3 3 4-6 5 8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      title: 'Your gallery, saved',
      body: 'Every image is stored with its prompt so you can search, favorite, and download anytime.',
      icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke-linecap="round"/></svg>',
    },
    {
      title: 'Credits, not subscriptions',
      body: 'Pay once for a pack of credits. One credit per image. No recurring charges.',
      icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10h6" stroke-linecap="round"/></svg>',
    },
  ];

  steps = [
    { n: 1, title: 'Write a prompt', body: 'Describe the scene, subject, and mood you want.' },
    { n: 2, title: 'Pick style & shape', body: 'Choose a look and an aspect ratio.' },
    { n: 3, title: 'Generate', body: 'Get your image and save it to your gallery.' },
  ];
}
