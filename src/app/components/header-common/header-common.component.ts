import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-common',
  standalone: false,
  
  templateUrl: './header-common.component.html',
  styleUrl: './header-common.component.css'
})
export class HeaderCommonComponent {
  authService = inject(AuthService);
  router = inject(Router);
  searchTerm = '';

  shouldShowSearch(): boolean {
    return this.router.url.startsWith('/about') || this.router.url.startsWith('/contact');
  }

  onSearch(): void {
    const trimmedValue = this.searchTerm.trim();
    this.router.navigate(['/listing'], {
      queryParams: trimmedValue ? { q: trimmedValue } : {}
    });
  }
}
