import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {
  router = inject(Router);
  countdown: number = 1; // Countdown starting from 3 seconds
  intervalId: any; // To hold the interval ID

  constructor() {
    // Start the countdown
    this.startCountdown();
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.intervalId); // Clear the interval
        this.router.navigateByUrl('/dashboard'); // Redirect to dashboard
      }
    }, 1000); // Decrease every second
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // Clear the interval on component destroy
  }
}