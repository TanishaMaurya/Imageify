import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { AuthResult, User } from '../models/user.model';

const TOKEN_KEY = 'imageify_token';
const USER_KEY = 'imageify_user';

/**
 * Holds authentication state using Angular signals.
 * The JWT is persisted in localStorage and attached by the auth interceptor.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly api = `${environment.apiUrl}/auth`;

  // ─── Reactive state ────────────────────────────────
  private _user = signal<User | null>(this.readUser());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly credits = computed(() => this._user()?.credits ?? 0);
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  signup(payload: { name: string; email: string; password: string }): Observable<ApiResponse<AuthResult>> {
    return this.http
      .post<ApiResponse<AuthResult>>(`${this.api}/signup`, payload)
      .pipe(tap((res) => this.persist(res.data)));
  }

  login(payload: { email: string; password: string }): Observable<ApiResponse<AuthResult>> {
    return this.http
      .post<ApiResponse<AuthResult>>(`${this.api}/login`, payload)
      .pipe(tap((res) => this.persist(res.data)));
  }

  /** Refresh the current user from the server (e.g. to sync credits). */
  refreshUser(): Observable<ApiResponse<{ user: User }>> {
    return this.http
      .get<ApiResponse<{ user: User }>>(`${this.api}/me`)
      .pipe(tap((res) => this.setUser(res.data.user)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  /** Locally update the cached user (used after credit changes). */
  setUser(user: User): void {
    this._user.set(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /** Patch just the credit balance in place. */
  setCredits(credits: number): void {
    const current = this._user();
    if (current) this.setUser({ ...current, credits });
  }

  private persist(result: AuthResult): void {
    localStorage.setItem(TOKEN_KEY, result.token);
    this.setUser(result.user);
  }

  private readUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
