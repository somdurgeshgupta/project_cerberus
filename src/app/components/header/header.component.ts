import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
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
  profileService = inject(ProfileService)
  router = inject(Router);
  profileData: any = {};
  countdown: number = 0; // Time left in seconds
  formattedCountdown: string = ''; // Formatted string for display
  private timerSubscription!: Subscription;

  @Output() toggleSidebar = new EventEmitter<void>();

  
  onToggleSidebar(req?:any) {
    req ? this.toggleSidebar.emit(req) : this.toggleSidebar.emit();
  }

  ngOnInit(): void {
    this.profileService.currentProfileImage.subscribe(imageUrl => {
      this.profileData.profileImage = imageUrl;
      // this.checkuserID();
    });
    this.authService.autoLogin();
      this.timerSubscription = this.authService.logoutTimer$.subscribe((timeLeft) => {
        this.countdown = timeLeft;
        this.formattedCountdown = this.formatCountdown(this.countdown);
      });
    if(this.authService.isLoggedIn()){
      this.checkuserID();
    } 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route matches About or Contact
        if (['/dashboard/about', '/dashboard/contact'].includes(event.urlAfterRedirects)) {
          this.onToggleSidebar(true); // Close the sidebar
        }
      }
    });
  }

  checkuserID() {
    this.userService.getUserProfile().subscribe((res:any)=>{
      this.profileData = res;
      this.profileData.profileImage = this.profileData.profileImage ? this.profileData.profileImage : this.profileData.picture || '/basic_user.jpg';
    })
  }


  logout() {
    this.authService.logout(true);
  }

  ngOnDestroy(): void {
    // Unsubscribe from the timer to avoid memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatCountdown(seconds: number): string {
    // Convert seconds into minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(minutes / 60); // Calculate hours
    const remainingMinutes = minutes % 60; // Remaining minutes after hours

    // Return formatted string as HH:MM:SS or similar
    return `${this.pad(hours)}:${this.pad(remainingMinutes)}:${this.pad(secs)}`;
  }

  pad(value: number): string {
    // Pad single-digit values with leading zeros
    return value < 10 ? `0${value}` : value.toString();
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/basic_user.jpg'; // Set fallback image if an error occurs
  }
  
}
