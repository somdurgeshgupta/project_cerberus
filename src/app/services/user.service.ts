import { inject, Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient);
  private tokenKey = 'authToken'; // Key to store token in localStorage

  getUserIdfromToken(): string | null {
    const token = localStorage.getItem(this.tokenKey); // Retrieve the token
    if (!token) {
      return null;
    }
    try {
      const decoded: { userId?: string } = jwtDecode(token);
      return decoded.userId || null;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getUserProfile(userId:any){
    return this.http.get(environment.API_URL + `users/${userId}`);
  }

  
  
}
