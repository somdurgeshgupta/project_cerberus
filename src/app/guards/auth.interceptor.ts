import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject Router dynamically
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isRefreshRequest = req.url.includes('/users/refresh-token') || req.url.includes('/users/login') || req.url.includes('/users/register') || req.url.includes('/googlelogin');

  const authReq = token
    ? req.clone({
        withCredentials: true,
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req.clone({ withCredentials: true });

  return next(authReq).pipe(
    // Catch errors in the response
    catchError((error) => {
      if (error.status === 401 && !isRefreshRequest) {
        return authService.refreshAccessToken().pipe(
          switchMap((newAccessToken) => {
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      if (error.status === 500 && error.message == 'The user with the given ID was not found.') {
        authService.logout();
        router.navigate(['/login']);
      }

      // Rethrow the error so other handlers can process it
      return throwError(() => error);
    })
  );
};
