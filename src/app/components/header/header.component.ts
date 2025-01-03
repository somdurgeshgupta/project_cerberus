import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  
  authService = inject(AuthService);
  userService = inject(UserService);
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
    // setInterval(()=>{
    this.authService.autoLogin();
      this.timerSubscription = this.authService.logoutTimer$.subscribe((timeLeft) => {
        this.countdown = timeLeft;
        this.formattedCountdown = this.formatCountdown(this.countdown);
      });
    // },100)
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
    this.userService.getUserProfile(this.userService.getUserIdfromToken()).subscribe((res)=>{
      this.profileData = res;
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
}
