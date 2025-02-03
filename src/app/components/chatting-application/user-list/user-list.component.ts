import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  standalone: false,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private router: Router, private authService: AuthService, private userService : UserService) {}

  ngOnInit(){
    this.getUsers();
  }

  getUsers(){
    this.authService.getAllUsers().subscribe((res: any) => {
      const currentUserId = this.userService.getUserIdfromToken(); // Get the logged-in user ID
      this.users = res.filter((user: any) => user.id !== currentUserId);
    });
  }

  goToChat(userId: string) {
    this.router.navigate(['/chatting/chat', userId]);
  }
}
