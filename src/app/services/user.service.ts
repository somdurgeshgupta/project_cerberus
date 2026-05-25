import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, shareReplay, tap } from 'rxjs/operators';

export type CurrentUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  picture?: string;
  [key: string]: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  private currentUserRequest$: Observable<CurrentUser | null> | null = null;

  currentUser$ = this.currentUserSubject.asObservable();

  get currentUserSnapshot(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  getUserProfile(forceRefresh = false): Observable<CurrentUser | null> {
    const cachedUser = this.currentUserSubject.value;

    if (cachedUser && !forceRefresh) {
      return of(cachedUser);
    }

    if (this.currentUserRequest$ && !forceRefresh) {
      return this.currentUserRequest$;
    }

    this.currentUserRequest$ = this.http.get<CurrentUser>(environment.API_URL + 'users/me/current').pipe(
      tap((user) => this.currentUserSubject.next(user)),
      catchError((error) => {
        this.currentUserSubject.next(null);
        throw error;
      }),
      finalize(() => {
        this.currentUserRequest$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    return this.currentUserRequest$;
  }

  updateCurrentUser(patch: Partial<CurrentUser>): void {
    const currentUser = this.currentUserSubject.value;

    if (currentUser) {
      this.currentUserSubject.next({ ...currentUser, ...patch });
    }
  }

  clearCurrentUser(): void {
    this.currentUserRequest$ = null;
    this.currentUserSubject.next(null);
  }

  getUserData(userId: any){
    return this.http.get(environment.API_URL + 'users/'+ userId);
  }

  updateProfile(image:any){
    console.log(image);
    return this.http.post(environment.API_URL + 'profile/upload-profile-image', image);
  }

  getActiveSessions() {
    return this.http.get(environment.API_URL + 'users/me/sessions');
  }

  revokeSession(sessionId: string) {
    return this.http.delete(environment.API_URL + 'users/me/sessions/' + sessionId);
  }

  
  
}
