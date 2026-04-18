import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-header-common',
  standalone: false,
  
  templateUrl: './header-common.component.html',
  styleUrl: './header-common.component.css'
})
export class HeaderCommonComponent {
  authService = inject(AuthService);
  router = inject(Router);
  userService = inject(UserService);
  profileService = inject(ProfileService);
  elementRef = inject(ElementRef);
  searchTerm = '';
  profileData: any = {};
  isProfileMenuOpen = false;

  ngOnInit(): void {
    this.profileService.currentProfileImage.subscribe((imageUrl) => {
      if (imageUrl) {
        this.profileData.profileImage = imageUrl;
      }
    });

    this.authService.initializeAuth().then(() => {
      if (this.authService.isLoggedIn()) {
        this.loadProfile();
      }
    });
  }

  shouldShowSearch(): boolean {
    return this.router.url.startsWith('/about') || this.router.url.startsWith('/contact');
  }

  onSearch(): void {
    const trimmedValue = this.searchTerm.trim();
    this.router.navigate(['/listing'], {
      queryParams: trimmedValue ? { q: trimmedValue } : {}
    });
  }

  loadProfile(): void {
    this.userService.getUserProfile().subscribe((res: any) => {
      this.profileData = res;
      this.profileData.profileImage = this.resolveProfileImage(this.profileData);
    });
  }

  resolveProfileImage(data: any): string {
    return data?.profileImage || data?.picture || '/basic_user.jpg';
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  navigateTo(path: string): void {
    this.isProfileMenuOpen = false;
    this.router.navigate([path]);
  }

  logout(): void {
    this.isProfileMenuOpen = false;
    this.authService.logout(true);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/basic_user.jpg';
    this.profileData.profileImage = '/basic_user.jpg';
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen = false;
    }
  }
}
