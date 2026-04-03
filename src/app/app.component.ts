import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-latest-application';
  hiddenPublicHeaderRoutes = ['/login', '/register', '/forgotpassword', '/'];
  hiddenPublicHeaderPrefixes = ['/dashboard'];

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
  }

  shouldShowPublicHeader(): boolean {
    const currentRoute = this.router.url;
    const isHiddenExactRoute = this.hiddenPublicHeaderRoutes.includes(currentRoute);
    const isHiddenPrefixRoute = this.hiddenPublicHeaderPrefixes.some((prefix) => currentRoute.startsWith(prefix));

    return !isHiddenExactRoute && !isHiddenPrefixRoute;
  }
  
}
