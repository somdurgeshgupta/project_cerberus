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
  @Input() isOpen: boolean = false;
  authService = inject(AuthService);
  router = inject(Router);

  showMore: boolean = false;

  showMoreOptions(): void {
    this.showMore = !this.showMore;
  }

  logout() {
    this.authService.logout(true);
  }

  downloadZipFile() {
    this.authService.downloadcsv().subscribe({
      next: (blob: Blob) => {
        const zipUrl = window.URL.createObjectURL(blob);

        // Open in new tab
        const newTab = window.open(zipUrl, '_blank');

        if (!newTab) {
          console.error('⚠️ Popup blocked! Could not open new tab.');
          return;
        }

        const a = newTab.document.createElement('a');
        a.href = zipUrl;
        a.download = 'data.zip';
        a.click();

        setTimeout(() => {
          window.URL.revokeObjectURL(zipUrl);
        }, 1000);
      },
      error: (err:any) => {
        console.error('❌ ZIP download error:', err);
      }
    });
  }




}
