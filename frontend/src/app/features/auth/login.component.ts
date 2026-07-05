import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SpinnerComponent],
  template: `
    <section class="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div class="card animate-fade-up">
        <h1 class="font-display text-2xl font-bold">Welcome back</h1>
        <p class="mt-1 text-sm text-slate-500">Log in to keep creating.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 space-y-4">
          <div>
            <label class="label" for="email">Email</label>
            <input id="email" type="email" formControlName="email" class="input" placeholder="you@example.com" autocomplete="email" />
            @if (invalid('email')) {
              <p class="mt-1 text-xs text-red-500">Enter a valid email.</p>
            }
          </div>

          <div>
            <label class="label" for="password">Password</label>
            <input id="password" type="password" formControlName="password" class="input" placeholder="••••••••" autocomplete="current-password" />
            @if (invalid('password')) {
              <p class="mt-1 text-xs text-red-500">Password is required.</p>
            }
          </div>

          <button type="submit" class="btn-primary w-full py-3" [disabled]="loading()">
            @if (loading()) { <app-spinner /> Logging in… } @else { Log in }
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-500">
          No account?
          <a routerLink="/signup" class="font-semibold text-iris-500 hover:underline">Sign up</a>
        </p>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.success('Logged in.');
        const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/dashboard';
        this.router.navigateByUrl(redirect);
      },
      error: () => this.loading.set(false),
    });
  }
}
