import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Functional implementation of CanActivateFn
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  if (!isLoggedIn) {
    router.navigate(['/login']);
  }
  return isLoggedIn;
};

// Optional: If you need a CanMatch guard function, you can add this:
export const canMatchGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  router.navigate([isLoggedIn ? '/admin-client' : '/login']);
  return isLoggedIn;
};
