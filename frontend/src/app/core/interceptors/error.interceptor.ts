import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Central HTTP error handling: shows a toast, and logs the user out on 401.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message =
        err.error?.message || err.statusText || 'Something went wrong. Please try again.';

      if (err.status === 401 && auth.isAuthenticated()) {
        toast.error('Your session expired. Please log in again.');
        auth.logout();
      } else if (err.status !== 401) {
        toast.error(message);
      }

      return throwError(() => err);
    })
  );
};
