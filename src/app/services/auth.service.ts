import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpClient) {  }

  private tokenKey = 'authToken'; // Key to store token in localStorage

  registration(val: any) {
    return this.http.post(environment.API_URL + 'users/register', val);
  }

  loginUser(val: any) {
    return this.http.post(environment.API_URL + 'users/login', val);
  }

  login(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserIdfromToken(){
    return this.http.post(environment.API_URL + 'users/getuseridfromtoken', localStorage.getItem(this.tokenKey));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}