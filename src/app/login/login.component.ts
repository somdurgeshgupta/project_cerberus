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
        this.loginWithGoogle();
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

  loginWithGoogle(): void {
    // Check if the DOM element exists
    const googleButton = document.getElementById('google-btn');
    if (!googleButton) {
      console.error('Google button element not found.');
      return;
    }
  
    try {
      // Initialize Google Identity Services
      google.accounts.id.initialize({
        client_id: '855831171805-hbharbt1j31v67i2ruve5trh2pa50blb.apps.googleusercontent.com', // Replace with your actual client ID
        callback: (response: any) => {
          console.log('Google Login Response:', response);
          if (!response || !response.credential) {
            console.error('No credential received from Google.');
            return;
          }
  
          // Attempt to store the token in localStorage
          try {
            
            console.log('Google token saved to localStorage.');
          } catch (storageError) {
            console.error('Failed to save token to localStorage:', storageError);
          }
  
          // Send the Google credential to the backend for verification
          this.authService.googlelogin(response.credential).subscribe(
            (res: any) => {
              if (res.token) {
                this.authService.login(res.token);
                localStorage.setItem('googleAuthToken', response.credential);
                this.router.navigateByUrl('/dashboard');
              } else {
                console.error('Token not received from backend.');
              }
            },
            (error) => {
              console.error('Error during backend login:', error);
            }
          );
        },
      });
  
      // Render Google Sign-In Button
      google.accounts.id.renderButton(googleButton, {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangle',
        width: 200, // Adjust width for better appearance
      });
  
      console.log('Google login initialized.');
    } catch (error) {
      console.error('Error during Google login initialization:', error);
    }
  }
  
  
  loginWithFacebook() {
    FB.init({
      appId: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
      cookie: true,
      xfbml: true,
      version: 'v15.0',
    });

    FB.login((response: any) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        this.authService.login(accessToken); // Send the token to your backend
        this.router.navigateByUrl('/dashboard'); // Redirect to dashboard
        console.log('Facebook login successful!', response);
      } else {
        console.log('Facebook login failed!', response);
      }
    }, { scope: 'email' }); // Request email permissions
  }
}