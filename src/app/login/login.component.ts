// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    if(authService.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.loginUser (this.loginForm.value).pipe(
        tap((res: any) => {
          if (res.token) {
            localStorage.setItem('authToken', res.token);
            this.router.navigateByUrl('/dashboard'); // Redirect to dashboard on successful login
          }
        }),
        catchError((error: any) => {
          alert('Login failed. Please check your credentials and try again.'); // Show error message
          return of(null); // Return a null observable to complete the stream
        })
      ).subscribe(); // Subscribe to execute the observable
    } else {
      alert('Please fill in all required fields correctly.'); // Show validation error message
    }
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