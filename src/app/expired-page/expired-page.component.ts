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
  @Input() isOpen: boolean = false;
  router = inject(Router);
  countdown: number = 3; // Countdown starting from 3 seconds
  intervalId: any; // To hold the interval ID
  logout:boolean = false;

  constructor(private route: ActivatedRoute) {
    // Start the countdown
    this.loadCountdownState();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['reason'] === 'sessionexpired') {
        this.logout = false;
      } else {
        this.logout = true;
      }
    });
    this.startCountdown();
  }

  loadCountdownState() {
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
