import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');

  // Inject Router dynamically
  const router = inject(Router);

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    // Catch errors in the response
    catchError((error) => {
      if (error.status === 401 || (error.status === 500 && error.message == 'The user with the given ID was not found.')) {
        // Handle JWT expiration
        console.warn('JWT expired. Logging out the user...');
        localStorage.removeItem('authToken'); // Clear token from storage
        router.navigate(['/login']); // Redirect to login page
      }

      // Rethrow the error so other handlers can process it
      return throwError(() => error);
    })
  );
};
