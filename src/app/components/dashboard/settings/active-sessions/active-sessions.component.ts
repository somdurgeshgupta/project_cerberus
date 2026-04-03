import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';

type ActiveSession = {
  sessionId: string;
  createdAt: string;
  lastUsedAt: string;
  userAgent?: string;
  ipAddress?: string;
  isCurrent: boolean;
};

@Component({
  selector: 'app-active-sessions',
  standalone: false,
  templateUrl: './active-sessions.component.html',
  styleUrl: './active-sessions.component.css'
})
export class ActiveSessionsComponent implements OnInit {
  sessions: ActiveSession[] = [];
  loading = false;
  revokingSessionId: string | null = null;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.userService.getActiveSessions().subscribe({
      next: (sessions: any) => {
        this.sessions = sessions;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  revokeSession(session: ActiveSession): void {
    this.revokingSessionId = session.sessionId;
    this.userService.revokeSession(session.sessionId).subscribe({
      next: () => {
        this.revokingSessionId = null;
        if (session.isCurrent) {
          this.authService.logout(true);
          return;
        }
        this.loadSessions();
      },
      error: () => {
        this.revokingSessionId = null;
      }
    });
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString();
  }
}
