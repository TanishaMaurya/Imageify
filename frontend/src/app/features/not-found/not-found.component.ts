import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <p class="font-display text-8xl font-extrabold">
        <span class="bg-spectrum-gradient bg-clip-text text-transparent">404</span>
      </p>
      <h1 class="mt-4 font-display text-2xl font-bold">This page didn't render</h1>
      <p class="mt-2 text-slate-500">
        The page you're looking for doesn't exist or was moved.
      </p>
      <a routerLink="/" class="btn-primary mt-8 px-6 py-3">Back to home</a>
    </section>
  `,
})
export class NotFoundComponent {}
