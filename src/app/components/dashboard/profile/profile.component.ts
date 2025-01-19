import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ProfileService } from '../../../profile.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  profileData:any = {};
  selectedFile: File | null = null;
  profileImage: string | ArrayBuffer | null = '/basic_user.jpg'; // Default image

  constructor(private fb: FormBuilder, private userService : UserService,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.checkuserID();
  }

  checkuserID(): void {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => {
        if (res) {
          // Update the form with the response data
          this.profileForm.patchValue(res);
  
          // Determine profile image source
          this.profileImage = res.profileImage ? res.profileImage : res.picture || '/basic_user.jpg';
        }
      },
      error: (error: any) => {
        console.error('Error fetching user profile:', error);
        // Optional: Handle errors here, e.g., show an error message to the user
      }
    });
  }
  

  // Handle image selection and preview
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      // Update profile image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result; // Update the preview image
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Submit handler
  onSubmit(): void {
    if (this.profileForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', this.selectedFile);
      this.userService.updateProfile(formData).subscribe((res:any)=>{
        this.profileService.updateProfileImage(res.imageUrl);
        this.selectedFile = null;
      });
    }
  }
}
