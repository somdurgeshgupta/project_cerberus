import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment.prod';

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
  profileImage: string | ArrayBuffer | null = 'assets/default-profile.png'; // Default image

  constructor(private fb: FormBuilder, private userService : UserService) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.checkuserID();
  }

  checkuserID() {
      this.userService.getUserProfile().subscribe((res:any)=>{
        // this.profileData = res;
        this.profileForm.patchValue(res);
        if(res.profileImage){
          this.profileImage = `${environment.API_URL + res.profileImage}`;
        }
      })
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
        console.log(res);
        
      });
    }
  }
}
