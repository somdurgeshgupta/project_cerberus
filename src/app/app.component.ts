import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-latest-application';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin(); // Reinitialize logout timer or log out the user
  }
  
}
