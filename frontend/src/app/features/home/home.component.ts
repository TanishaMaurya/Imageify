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
      <!-- Animated aurora mesh background -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute left-1/4 top-0 h-[500px] w-[600px] animate-mesh-move rounded-full opacity-30 blur-[120px]"
             style="background: radial-gradient(circle, rgba(232,82,122,0.4) 0%, transparent 70%);"></div>
        <div class="absolute right-1/4 top-20 h-[400px] w-[500px] animate-mesh-move rounded-full opacity-20 blur-[100px]"
             style="background: radial-gradient(circle, rgba(240,160,48,0.35) 0%, transparent 70%); animation-delay: -7s;"></div>
        <div class="absolute bottom-0 left-1/2 h-[350px] w-[500px] -translate-x-1/2 animate-mesh-move rounded-full opacity-20 blur-[100px]"
             style="background: radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%); animation-delay: -14s;"></div>
      </div>

      <!-- Grid pattern overlay -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden="true"
           style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 60px;"></div>

      <div class="relative mx-auto max-w-4xl px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-32">
        <!-- Floating badge -->
        <span
          class="animate-fade-up inline-flex items-center gap-2 rounded-full border border-flame-500/20 bg-flame-500/[0.06] px-4 py-1.5 text-xs font-semibold text-flame-400"
          style="box-shadow: 0 0 20px -5px rgba(232, 82, 122, 0.2);">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-flame-400"></span>
          </span>
          10 free credits when you sign up
        </span>

        <h1
          class="animate-fade-up-delay-1 mt-8 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-7xl">
          Turn words into
          <span class="text-gradient">stunning images</span>
          in seconds.
        </h1>

        <p class="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Describe anything. Pick a style and shape. VisionCraft AI renders it with AI —
          then keep, download, and revisit your whole gallery.
        </p>

        <div class="animate-fade-up-delay-3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          @if (auth.isAuthenticated()) {
            <a routerLink="/generate" class="btn-primary px-7 py-3.5 text-base">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16l4-5 3 3 4-6 5 8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Start generating
            </a>
            <a routerLink="/dashboard" class="btn-ghost px-7 py-3.5 text-base">Go to dashboard</a>
          } @else {
            <a routerLink="/signup" class="btn-primary px-7 py-3.5 text-base">
              Create free account
            </a>
            <a routerLink="/pricing" class="btn-ghost px-7 py-3.5 text-base">See pricing</a>
          }
        </div>
      </div>
    </section>

    <!-- Features — bento grid -->
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (f of features; track f.title; let idx = $index) {
          <div class="card group transition-all duration-500 hover:border-white/10"
               [class.sm:col-span-2]="idx === 0"
               [class.lg:col-span-1]="true"
               style="transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s;"
               [style.animation-delay]="idx * 100 + 'ms'">

            <!-- Hover glow -->
            <div class="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                 [style.background]="f.glowBg"></div>

            <div class="relative">
              <div class="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-white/[0.06]"
                   [style.background]="f.iconBg"
                   [style.color]="f.iconColor">
               @if (f.icon === 'style') {
<svg viewBox="0 0 24 24"
     class="h-6 w-6"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">
  <path d="M4 16l4-5 3 3 4-6 5 8"/>
</svg>
}

@if (f.icon === 'gallery') {
<svg viewBox="0 0 24 24"
     class="h-6 w-6"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2"/>
  <path d="M3 15l5-5 4 4 3-3 6 6"/>
</svg>
}

@if (f.icon === 'credits') {
<svg viewBox="0 0 24 24"
     class="h-6 w-6"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">
  <circle cx="12" cy="12" r="9"/>
  <path d="M12 7v10M9 10h6"/>
</svg>
}
              </div>
              <h3 class="font-display text-lg font-bold text-white">{{ f.title }}</h3>
              <p class="mt-2 text-sm text-slate-400">{{ f.body }}</p>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Steps — connected timeline -->
    <section class="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <h2 class="text-center font-display text-3xl font-bold text-white">
        Three steps to your <span class="text-gradient">image</span>
      </h2>

      <div class="relative mt-14">
        <!-- Connector line (desktop) -->
        <div class="absolute left-0 right-0 top-8 hidden h-px sm:block"
             style="background: linear-gradient(90deg, transparent, rgba(232,82,122,0.3), rgba(240,160,48,0.3), rgba(167,139,250,0.3), transparent);"></div>

        <div class="grid gap-8 sm:grid-cols-3">
          @for (s of steps; track s.n; let idx = $index) {
            <div class="relative text-center"
                 [style.animation]="'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) ' + (idx * 150) + 'ms both'">
              <!-- Step number -->
              <span
                class="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl font-display text-lg font-bold text-white"
                [style.background]="s.gradient"
                [style.box-shadow]="s.glow">
                {{ s.n }}
              </span>
              <h3 class="mt-5 text-lg font-semibold text-white">{{ s.title }}</h3>
              <p class="mt-2 text-sm text-slate-400">{{ s.body }}</p>
            </div>
          }
        </div>
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
      icon: 'style',
      iconBg: 'rgba(232,82,122,.08)',
      iconColor: '#ceb9bd',
      glowBg: 'radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(232,82,122,.04), transparent 40%)',
    },
    {
      title: 'Your gallery, saved',
      body: 'Every image is stored with its prompt so you can search, favorite, and download anytime.',
      icon: 'gallery',
      iconBg: 'rgba(240,160,48,.08)',
      iconColor: '#FFC842',
      glowBg: 'radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(240,160,48,.04), transparent 40%)',
    },
    {
      title: 'Credits, not subscriptions',
      body: 'Pay once for a pack of credits. One credit per image. No recurring charges.',
      icon: 'credits',
      iconBg: 'rgba(167,139,250,.08)',
      iconColor: '#C4B5FD',
      glowBg: 'radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(167,139,250,.04), transparent 40%)',
    },
  ];
  steps = [
    {
      n: 1,
      title: 'Write a prompt',
      body: 'Describe the scene, subject, and mood you want.',
      gradient: 'linear-gradient(135deg, #E8527A, #D03A62)',
      glow: '0 0 30px -5px rgba(232, 82, 122, 0.4)',
    },
    {
      n: 2,
      title: 'Pick style & shape',
      body: 'Choose a look and an aspect ratio.',
      gradient: 'linear-gradient(135deg, #F0A030, #D48A20)',
      glow: '0 0 30px -5px rgba(240, 160, 48, 0.4)',
    },
    {
      n: 3,
      title: 'Generate',
      body: 'Get your image and save it to your gallery.',
      gradient: 'linear-gradient(135deg, #A78BFA, #8B5CF6)',
      glow: '0 0 30px -5px rgba(167, 139, 250, 0.4)',
    },
  ];
}
