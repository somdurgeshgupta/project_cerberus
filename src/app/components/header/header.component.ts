import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  profileService = inject(ProfileService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  profileData: any = {};
  countdown: number = 0; // Time left in seconds
  formattedCountdown: string = ''; // Formatted string for display
  searchTerm = '';
  isProfileMenuOpen = false;
  private timerSubscription!: Subscription;

  ngOnInit(): void {
    this.profileService.currentProfileImage.subscribe(imageUrl => {
      if (imageUrl) {
        this.profileData.profileImage = imageUrl;
      }
    });
    this.timerSubscription = this.authService.logoutTimer$.subscribe((timeLeft) => {
      this.countdown = timeLeft;
      this.formattedCountdown = this.formatCountdown(this.countdown);
    });
    this.authService.initializeAuth().then(() => {
      if(this.authService.isLoggedIn()){
        this.checkuserID();
      }
    });
  }

  checkuserID() {
    this.userService.getUserProfile().subscribe((res:any)=>{
      this.profileData = res;
      this.profileData.profileImage = this.resolveProfileImage(this.profileData);
    })
  }

  resolveProfileImage(data: any): string {
    return data?.profileImage || data?.picture || '/basic_user.jpg';
  }


  logout() {
    this.isProfileMenuOpen = false;
    this.authService.logout(true);
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  navigateTo(path: string): void {
    this.isProfileMenuOpen = false;
    this.router.navigate([path]);
  }

  onSearch(): void {
    const trimmedValue = this.searchTerm.trim();
    this.router.navigate(['/listing'], {
      queryParams: trimmedValue ? { q: trimmedValue } : {}
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the timer to avoid memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatCountdown(seconds: number): string {
    const totalSeconds = Math.max(0, seconds);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
    }

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
  }

  pad(value: number): string {
    // Pad single-digit values with leading zeros
    return value < 10 ? `0${value}` : value.toString();
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/basic_user.jpg'; // Set fallback image if an error occurs
    this.profileData.profileImage = '/basic_user.jpg';
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen = false;
    }
  }
  
}
