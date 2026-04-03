declare var google:any;
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, firstValueFrom, interval, throwError } from 'rxjs';
import { catchError, filter, finalize, map, take, takeWhile, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private rawHttp: HttpClient;
  private accessToken: string | null = null;
  private accessTokenExpiration: number | null = null;
  private tokenExpirationTimer: any;
  private logoutTimerSubscription: Subscription | null = null;
  private logoutTimerSubject = new BehaviorSubject<number>(0); // Remaining time in seconds
  public logoutTimer$ = this.logoutTimerSubject.asObservable(); // Observable to track timer
  
  private refreshInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private authInitialized = false;
  private authInitializationPromise: Promise<void> | null = null;

  constructor(private http: HttpClient, private router: Router, httpBackend: HttpBackend) {
    this.rawHttp = new HttpClient(httpBackend);
  }

  registration(val: any) {
    return this.http.post(environment.API_URL + 'users/register', val, { withCredentials: true });
  }

  loginUser(val: any) {
    console.log("submit api")
    return this.http.post(environment.API_URL + 'users/login', val, { withCredentials: true });
  }

  getToken(): string | null {
    return this.accessToken;
  }

  initializeAuth(): Promise<void> {
    if (this.authInitialized) {
      return Promise.resolve();
    }

    if (this.authInitializationPromise) {
      return this.authInitializationPromise;
    }

    this.authInitializationPromise = this.bootstrapAuth();
    return this.authInitializationPromise;
  }

  googlelogin(token: string){
    let data = { "tokendata": token }
    return this.http.post(environment.API_URL + 'googlelogin', data, { withCredentials: true });
  }

  login(authResponse: { accessToken: string }): void {
    // Clear any existing state before starting a new session
    this.clearSession();

    const expirationTime = this.getTokenExpiration(authResponse.accessToken);

    if (!expirationTime) {
      this.clearSession();
      return;
    }

    this.accessToken = authResponse.accessToken;
    this.accessTokenExpiration = expirationTime;

    // Start a new logout timer
    this.startLogoutCountdown(expirationTime - Date.now());
  }

  logout(btnCLicked?: boolean): void {
    console.warn('Session expired or user logged out. Logging out the user...');
    this.rawHttp.post(`${environment.API_URL}users/logout`, {}, { withCredentials: true }).subscribe({
      error: () => {}
    });
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
    void this.initializeAuth();
  }

  private startLogoutCountdown(duration: number): void {
    // Clear any existing timer or observable subscription
    this.clearTimer();

    const safeDuration = Math.max(0, duration);
    this.logoutTimerSubject.next(Math.floor(safeDuration / 1000));

    // Update the timer observable every second
    const expirationTime = Date.now() + safeDuration;
    this.logoutTimerSubscription = interval(1000)
      .pipe(
        takeWhile(() => Date.now() < expirationTime), // Stop when expired
        map(() => Math.max(0, Math.floor((expirationTime - Date.now()) / 1000))) // Remaining time in seconds
      )
      .subscribe({
        next: (timeLeft) => this.logoutTimerSubject.next(timeLeft),
        complete: () => this.handleAccessTokenExpiry()
      });

    // Set a hard logout timer
    this.tokenExpirationTimer = setTimeout(() => {
      this.handleAccessTokenExpiry();
    }, safeDuration);
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
    this.accessToken = null;
    this.accessTokenExpiration = null;
    this.refreshTokenSubject.next(null);
    this.refreshInProgress = false;
    this.logoutTimerSubject.next(0);
  }

  isLoggedIn(): boolean {
    if (this.accessToken) {
      const expirationTime = this.accessTokenExpiration ?? this.getTokenExpiration(this.accessToken);
      return !!expirationTime && expirationTime > Date.now();
    }
    return false;
  }

  refreshAccessToken(): Observable<string> {
    if (this.refreshInProgress) {
      return this.refreshTokenSubject.pipe(
        filter((token): token is string => !!token),
        take(1)
      );
    }

    this.refreshInProgress = true;
    this.refreshTokenSubject.next(null);

    return this.rawHttp.post<{ accessToken: string }>(
      `${environment.API_URL}users/refresh-token`,
      {},
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        const expirationTime = this.getTokenExpiration(response.accessToken);
        if (expirationTime) {
          this.accessToken = response.accessToken;
          this.accessTokenExpiration = expirationTime;
          this.startLogoutCountdown(expirationTime - Date.now());
        }

        this.refreshInProgress = false;
        this.refreshTokenSubject.next(response.accessToken);
      }),
      map((response) => response.accessToken),
      catchError((error) => {
        this.refreshInProgress = false;
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  private handleAccessTokenExpiry(): void {
    this.refreshAccessToken().subscribe({
      next: () => {
        // The new access token is already stored and the timer restarted.
      },
      error: () => this.logout()
    });
  }

  private async bootstrapAuth(): Promise<void> {
    try {
      if (this.accessToken) {
        const expiration = this.accessTokenExpiration ?? this.getTokenExpiration(this.accessToken);
        const currentTime = Date.now();

        if (expiration && expiration > currentTime) {
          this.startLogoutCountdown(expiration - currentTime);
          return;
        }
      }

      await firstValueFrom(
        this.refreshAccessToken().pipe(
          catchError(() => {
            this.clearSession();
            return [];
          })
        )
      );
    } catch (error) {
      this.clearSession();
    } finally {
      this.authInitialized = true;
      this.authInitializationPromise = null;
    }
  }

  private getTokenExpiration(token: string): number | null {
    try {
      const decodedToken: { exp?: number } = jwtDecode(token);
      return decodedToken.exp ? decodedToken.exp * 1000 : null;
    } catch (error) {
      console.error('Failed to decode token expiration:', error);
      return null;
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
              if (res.accessToken) {
                this.login(res);
                const redirectUrl = localStorage.getItem('postAuthRedirect') || '/dashboard';
                localStorage.removeItem('postAuthRedirect');
                this.router.navigateByUrl(redirectUrl);
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

  getAllUsers(){
    return this.http.get(environment.API_URL + 'users');
  }

  forgotpassword(val:any){
    return this.http.post(environment.API_URL + 'users/forgetpassword', val);
  }
}
