declare var google:any;
declare var FB:any;

// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
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

  ngOnInit(): void {
    const interval = setInterval(() => {
      if (typeof google !== 'undefined') {
        this.registerWithGoogle();
        clearInterval(interval);
      }
    }, 100);
  }
  
  
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).pipe(
        tap((res: any) => {
          if (res.token) {
            this.authService.login(res.token);
            // localStorage.setItem('authToken', res.token);
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

  registerWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
  
  
  // loginWithFacebook() {
  //   FB.init({
  //     appId: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
  //     cookie: true,
  //     xfbml: true,
  //     version: 'v15.0',
  //   });

  //   FB.login((response: any) => {
  //     if (response.authResponse) {
  //       const accessToken = response.authResponse.accessToken;
  //       this.authService.login(accessToken); // Send the token to your backend
  //       this.router.navigateByUrl('/dashboard'); // Redirect to dashboard
  //       console.log('Facebook login successful!', response);
  //     } else {
  //       console.log('Facebook login failed!', response);
  //     }
  //   }, { scope: 'email' }); // Request email permissions
  // }
}