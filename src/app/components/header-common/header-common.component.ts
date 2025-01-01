import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-common',
  standalone: false,
  
  templateUrl: './header-common.component.html',
  styleUrl: './header-common.component.css'
})
export class HeaderCommonComponent {

  @Output() toggleSidebar = new EventEmitter<void>();

  registerRoute: boolean = false;
  
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.registerRoute = this.router.url === '/login';
    });
  }
  
    onToggleSidebar() {
      this.toggleSidebar.emit();
    }
    
}
