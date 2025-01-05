import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: false,

  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  forgotpasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.forgotpasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  

onSubmit() {
  if (this.forgotpasswordForm.valid) {
    this.authService.forgotpassword(this.forgotpasswordForm.value)
      .pipe(
        catchError((err: any) => {
          // Convert the error response to a custom object for `next` to handle
          console.error('Error occurred:', err);
          return of({ success: false, message: err.error?.message || 'Request failed with status ' + err.status });
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            alert(res.message); // Replace with notification service if available
            this.router.navigate(['']);
          } else {
            alert(res.message || 'Something went wrong.'); // Replace with notification service if available
          }
        },
        complete: () => {
          console.log('Password reset request completed.');
        }
      });
  } else {
    alert('Please fill in all required fields correctly.');
  }
}

  
  
  
}
