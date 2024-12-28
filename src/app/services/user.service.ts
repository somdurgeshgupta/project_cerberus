import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserService {

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
  
}
