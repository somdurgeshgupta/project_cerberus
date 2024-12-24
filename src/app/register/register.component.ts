// src/app/register/register.component.ts
import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  onSubmit() {
    // Handle registration with username, email, and password
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // Add your registration logic here
  }

  registerWithGoogle() {
    // Handle Google registration
    console.log('Register with Google');
    // Add your Google registration logic here
  }

  registerWithFacebook() {
    // Handle Facebook registration
    console.log('Register with Facebook');
    // Add your Facebook registration logic here
  }
}