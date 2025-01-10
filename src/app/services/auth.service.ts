declare var google:any;
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpClient, private router: Router) {  }
  private tokenExpirationTimer: any;
  private logoutTimerSubscription: Subscription | null = null;
  private logoutTimerSubject = new BehaviorSubject<number>(0); // Remaining time in seconds
  public logoutTimer$ = this.logoutTimerSubject.asObservable(); // Observable to track timer
  
  private tokenKey = 'authToken'; // Key to store token in localStorage

  registration(val: any) {
    return this.http.post(environment.API_URL + 'users/register', val);
  }

  loginUser(val: any) {
    return this.http.post(environment.API_URL + 'users/login', val);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  googlelogin(token: string){
    let data = { "tokendata": token }
    return this.http.post(environment.API_URL + 'googlelogin', data);
  }

  login(token: string): void {
    // Clear any existing state before starting a new session
    this.clearSession();

    // Save token to localStorage
    localStorage.setItem('authToken', token);

    // Decode the token to extract expiration time
    const decodedToken: any = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds

    // Save expiration time in localStorage
    localStorage.setItem('tokenExpiration', expirationTime.toString());

    // Start a new logout timer
    this.startLogoutCountdown(expirationTime - Date.now());
  }

  logout(btnCLicked?: boolean): void {
    console.warn('Session expired or user logged out. Logging out the user...');
    if (typeof google !== 'undefined') {
      google.accounts.id.revoke(localStorage.getItem('googleAuthToken') || '', (done: any) => {
        console.log('Google token revoked.');
      });
    } else {
      console.error('Google object is not available.');
    }
    this.clearSession(); // Clear all session-related data and timers
    if(btnCLicked){
      this.router.navigate(['/expired-page']);
    }else{
        this.router.navigate(['/expired-page'], { 
          queryParams: { reason: 'sessionexpired' } 
        });
      }
  }

  autoLogin(): void {
    const token = localStorage.getItem('authToken');
    const expirationTime = localStorage.getItem('tokenExpiration');

    if (token && expirationTime) {
      const expiration = parseInt(expirationTime, 10);
      const currentTime = Date.now();

      if (expiration > currentTime) {
        // Token is still valid, set a new timer
        this.startLogoutCountdown(expiration - currentTime);
      } else {
        // Token has expired, log the user out
        this.logout();
      }
    }
  }

  private startLogoutCountdown(duration: number): void {
    // Clear any existing timer or observable subscription
    this.clearTimer();

    // Update the timer observable every second
    const expirationTime = Date.now() + duration;
    this.logoutTimerSubscription = interval(1000)
      .pipe(
        takeWhile(() => Date.now() < expirationTime), // Stop when expired
        map(() => Math.max(0, Math.floor((expirationTime - Date.now()) / 1000))) // Remaining time in seconds
      )
      .subscribe({
        next: (timeLeft) => this.logoutTimerSubject.next(timeLeft),
        complete: () => this.logout()
      });

    // Set a hard logout timer
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private clearTimer(): void {
    // Clear the timer observable subscription
    if (this.logoutTimerSubscription) {
      this.logoutTimerSubscription.unsubscribe();
      this.logoutTimerSubscription = null;
    }

    // Clear the hard logout timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  private clearSession(): void {
    // Clear timers and localStorage
    this.clearTimer();
    this.logoutTimerSubject.next(0);
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (token && expirationTime) {
      return parseInt(expirationTime, 10) > Date.now(); // Check if token is still valid
    }
    return false;
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
        client_id: environment.GOOGLE_AUTH_KEY, // Replace with your actual client ID
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
          this.googlelogin(response.credential).subscribe(
            (res: any) => {
              if (res.token) {
                this.login(res.token);
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
        size: 'pill',
        shape: 'rectangle',
        width: 200, // Adjust width for better appearance
      });
  
      console.log('Google login initialized.');
    } catch (error) {
      console.error('Error during Google login initialization:', error);
    }
  }

  forgotpassword(val:any){
    return this.http.post(environment.API_URL + 'users/forgetpassword', val);
  }
}