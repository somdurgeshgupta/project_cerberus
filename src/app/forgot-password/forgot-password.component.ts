import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  forgotpasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
      this.forgotpasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
      
    }
  
    onSubmit(){
      this.authService.forgotpassword(this.forgotpasswordForm.value).subscribe((res:any)=>{
        console.log(res);
      })
    }

}
