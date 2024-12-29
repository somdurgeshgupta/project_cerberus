import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
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

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  ngOnInit(): void {
    this.timerSubscription = this.authService.logoutTimer$.subscribe((timeLeft) => {
      this.countdown = timeLeft;
      this.formattedCountdown = this.formatCountdown(this.countdown);
    });
    this.checkuserID();
  }

  checkuserID() {
    this.userService.getUserProfile(this.userService.getUserIdfromToken()).subscribe((res)=>{
      this.profileData = res;
    })
  }


  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

  ngOnDestroy(): void {
    // Unsubscribe from the timer to avoid memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatCountdown(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${this.pad(minutes)}:${this.pad(secs)}`;
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}
