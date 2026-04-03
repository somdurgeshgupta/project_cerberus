import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient);

  getUserProfile(){
    return this.http.get(environment.API_URL + 'users/me/current');
  }

  getUserData(userId: any){
    return this.http.get(environment.API_URL + 'users/'+ userId);
  }

  updateProfile(image:any){
    console.log(image);
    return this.http.post(environment.API_URL + 'profile/upload-profile-image', image);
  }

  
  
}
