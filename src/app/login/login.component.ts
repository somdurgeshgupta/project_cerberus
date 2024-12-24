// src/app/login/login.component.ts
import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onSubmit() {
    // Handle login with email and password
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // Add your authentication logic here
  }

  loginWithGoogle() {
    // Handle Google login
    console.log('Login with Google');
    // Add your Google login logic here
  }

  loginWithFacebook() {
    // Handle Facebook login
    console.log('Login with Facebook');
    // Add your Facebook login logic here
  }
}