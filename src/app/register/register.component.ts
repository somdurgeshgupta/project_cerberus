// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.registration(this.registerForm.value).subscribe(
        (res:any) => {
          localStorage.setItem('authToken', res.token);
          this.router.navigateByUrl('/dashboard');
        },
        (error) => {
          alert('Registration failed. Please try again.'); // Show error message
        }
      );
    } else {
      alert('Please fill in all required fields correctly.'); // Show validation error message
    }
  }

  registerWithGoogle() {
    // Handle Google registration
   
    // Handle Google registration
    console.log('Register with Google');
    // Add your Google registration logic here
  }

  registerWithFacebook() {
    // Handle Facebook registration
    console.log('Register with Facebook');
    // Add your Facebook registration logic here
  }
}