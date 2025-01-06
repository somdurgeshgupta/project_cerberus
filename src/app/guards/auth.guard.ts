import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Functional implementation of CanActivateFn
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  
  // Check if the user is trying to access the login page
  if (!isLoggedIn && state.url !== '/login') {
    router.navigate(['/']);
  }

  return isLoggedIn || state.url === '/login'; // Allow access to login page if not logged in
};


