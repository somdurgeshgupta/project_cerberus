import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-common',
  standalone: false,
  
  templateUrl: './header-common.component.html',
  styleUrl: './header-common.component.css'
})
export class HeaderCommonComponent {

  @Output() toggleSidebar = new EventEmitter<void>();
  
    onToggleSidebar() {
      this.toggleSidebar.emit();
    }
    
}
