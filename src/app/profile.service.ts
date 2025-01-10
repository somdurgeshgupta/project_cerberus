// profile.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileImageSource = new BehaviorSubject<string | null>(null);
  currentProfileImage = this.profileImageSource.asObservable();

  updateProfileImage(imageUrl: string) {
    this.profileImageSource.next(imageUrl);
  }
}
