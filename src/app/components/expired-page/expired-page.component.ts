import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expired-page',
  standalone: false,

  templateUrl: './expired-page.component.html',
  styleUrl: './expired-page.component.css',
})
export class ExpiredPageComponent implements OnInit {
  router = inject(Router);
  countdown: number = 3; // Countdown starting from 3 seconds
  intervalId: any; // To hold the interval ID
  logout:boolean = false;

  constructor(private route: ActivatedRoute) {
    // Start the countdown
    this.expiredValueCheck();
    this.loadCountdownState();
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  expiredValueCheck(): void {
    this.route.queryParams.subscribe(params => {
      const reason = params['reason'];
      switch (reason) {
        case 'sessionexpired':
          this.logout = false;
          break;
        case 'logoutexpired':
          this.logout = true;
          break;
        default:
          this.router.navigateByUrl('/');
      }
    });
  }
  

  loadCountdownState() {
    console.log("hellosdfoaid")
    const savedCountdown = sessionStorage.getItem('countdown');
    if (savedCountdown) {
      this.countdown = parseInt(savedCountdown, 10);
    }
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      sessionStorage.setItem('countdown', this.countdown.toString()); // Save countdown value
      if (this.countdown <= 0) {
        clearInterval(this.intervalId); // Clear the interval
        this.router.navigateByUrl('/login'); // Redirect to login
      }
    }, 1000); // Decrease every second
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // Clear the interval on component destroy
    sessionStorage.removeItem('countdown'); // Clear countdown from storage
  }
}
