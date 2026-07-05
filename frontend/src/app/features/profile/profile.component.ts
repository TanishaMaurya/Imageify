import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { ApiResponse } from '../../core/models/api.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent, DatePipe],
  template: `
    <section class="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 class="font-display text-3xl font-bold">Profile</h1>

      <!-- Summary -->
      <div class="mt-6 card flex items-center gap-4">
        <span class="grid h-14 w-14 place-items-center rounded-2xl bg-spectrum-gradient font-display text-xl font-bold text-white shadow-glow">
          {{ initials() }}
        </span>
        <div>
          <p class="font-semibold">{{ auth.user()?.name }}</p>
          <p class="text-sm text-slate-500">{{ auth.user()?.email }}</p>
          <p class="mt-1 text-xs text-slate-400">
            Member since {{ auth.user()?.createdAt | date: 'MMM y' }} ·
            {{ auth.credits() }} credits
          </p>
        </div>
      </div>

      <!-- Edit profile -->
      <div class="mt-6 card">
        <h2 class="font-display text-lg font-bold">Account details</h2>
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="mt-4 space-y-4">
          <div>
            <label class="label" for="name">Name</label>
            <input id="name" formControlName="name" class="input" />
          </div>
          <div>
            <label class="label" for="email">Email</label>
            <input id="email" type="email" formControlName="email" class="input" />
          </div>
          <button type="submit" class="btn-primary" [disabled]="savingProfile()">
            @if (savingProfile()) { <app-spinner /> Saving… } @else { Save changes }
          </button>
        </form>
      </div>

      <!-- Change password -->
      <div class="mt-6 card">
        <h2 class="font-display text-lg font-bold">Change password</h2>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="mt-4 space-y-4">
          <div>
            <label class="label" for="current">Current password</label>
            <input id="current" type="password" formControlName="currentPassword" class="input" autocomplete="current-password" />
          </div>
          <div>
            <label class="label" for="new">New password</label>
            <input id="new" type="password" formControlName="newPassword" class="input" autocomplete="new-password" />
            @if (pInvalid('newPassword')) {
              <p class="mt-1 text-xs text-red-500">New password must be at least 6 characters.</p>
            }
          </div>
          <button type="submit" class="btn-ghost" [disabled]="savingPassword()">
            @if (savingPassword()) { <app-spinner /> Updating… } @else { Update password }
          </button>
        </form>
      </div>
    </section>
  `,
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  auth = inject(AuthService);
  private toast = inject(ToastService);
  private readonly api = `${environment.apiUrl}/auth`;

  savingProfile = signal(false);
  savingPassword = signal(false);

  profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    const user = this.auth.user();
    if (user) {
      this.profileForm.patchValue({ name: user.name, email: user.email });
    }
  }

  initials(): string {
    return (this.auth.user()?.name ?? '')
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  pInvalid(name: string): boolean {
    const c = this.passwordForm.get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.savingProfile.set(true);
    this.http
      .patch<ApiResponse<{ user: User }>>(`${this.api}/profile`, this.profileForm.getRawValue())
      .subscribe({
        next: (res) => {
          this.auth.setUser(res.data.user);
          this.toast.success('Profile updated.');
          this.savingProfile.set(false);
        },
        error: () => this.savingProfile.set(false),
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.savingPassword.set(true);
    this.http
      .patch<ApiResponse<null>>(`${this.api}/change-password`, this.passwordForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.success('Password updated.');
          this.passwordForm.reset();
          this.savingPassword.set(false);
        },
        error: () => this.savingPassword.set(false),
      });
  }
}
