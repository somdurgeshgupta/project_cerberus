import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  isSidebarOpen: boolean = true;

  toggleSidebar(event?: any) {
    this.isSidebarOpen = event ? false : !this.isSidebarOpen;
  }
  
}
