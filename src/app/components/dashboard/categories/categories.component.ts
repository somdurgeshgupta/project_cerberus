import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})

export class CategoriesComponent implements OnInit {

  authService = inject(AuthService)

  ngOnInit(): void {
    this.checkuserID();
  }

  checkuserID(){
    this.authService.getUserIdfromToken().subscribe((res)=>{
      console.log(res);
    })
  }
}
