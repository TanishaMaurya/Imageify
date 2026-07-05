import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SpinnerComponent],
  template: `
    <section class="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div class="card animate-fade-up">
        <h1 class="font-display text-2xl font-bold">Create your account</h1>
        <p class="mt-1 text-sm text-slate-500">Get 10 free credits to start.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 space-y-4">
          <div>
            <label class="label" for="name">Name</label>
            <input id="name" type="text" formControlName="name" class="input" placeholder="Ada Lovelace" autocomplete="name" />
            @if (invalid('name')) {
              <p class="mt-1 text-xs text-red-500">Name must be at least 2 characters.</p>
            }
          </div>

          <div>
            <label class="label" for="email">Email</label>
            <input id="email" type="email" formControlName="email" class="input" placeholder="you@example.com" autocomplete="email" />
            @if (invalid('email')) {
              <p class="mt-1 text-xs text-red-500">Enter a valid email.</p>
            }
          </div>

          <div>
            <label class="label" for="password">Password</label>
            <input id="password" type="password" formControlName="password" class="input" placeholder="At least 6 characters" autocomplete="new-password" />
            @if (invalid('password')) {
              <p class="mt-1 text-xs text-red-500">Password must be at least 6 characters.</p>
            }
          </div>

          <button type="submit" class="btn-primary w-full py-3" [disabled]="loading()">
            @if (loading()) { <app-spinner /> Creating account… } @else { Create account }
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-500">
          Already have an account?
          <a routerLink="/login" class="font-semibold text-iris-500 hover:underline">Log in</a>
        </p>
      </div>
    </section>
  `,
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  loading = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
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
    this.auth.signup(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.success('Account created. Welcome to Imageify!');
        this.router.navigateByUrl('/dashboard');
      },
      error: () => this.loading.set(false),
    });
  }
}
