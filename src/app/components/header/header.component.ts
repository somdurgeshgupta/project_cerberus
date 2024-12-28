import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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
  userId: string | null = null;

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  ngOnInit(): void {
    this.checkuserID();
  }

  checkuserID() {
    this.userId = this.userService.getUserIdfromToken();
    console.log('User ID:', this.userId);
  }


  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}
