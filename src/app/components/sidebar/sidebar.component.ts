import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
  

@Component({
  selector: 'app-sidebar',
  standalone: false,
  
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  authService = inject(AuthService);
  router = inject(Router);


  logout(){
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}
