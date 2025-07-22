import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../services/auth-service/auth-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule,RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, MatIconModule,CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  forgotForm: FormGroup;
  submitted = false;
  sendResetLinkLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private authApi : AuthApiService,
      private toastr: ToastrService) {
    this.forgotForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, this.emailValidator.bind(this)]]
    });
  }

  get email() {
    return this.forgotForm.get('email');
  }
  get userName() {
    return this.forgotForm.get('userName');
  }

  get isFormValid() {
    return this.forgotForm.valid;
  }
  emailValidator(control: AbstractControl): ValidationErrors | null {
    return this.authService.isValid(control.value || '') ? null : { emailInvalid: true };
  }
  onSubmit(): void {
    if (!this.isFormValid) return; // or this.resetForm.invalid if using Angular form validation

    this.sendResetLinkLoading = true;

    // Call your service method
    this.authApi.sendResetPasswordEmail(
      this.forgotForm.value.email,
      this.forgotForm.value.userName
    ).subscribe({
      next: (res) => {
        this.sendResetLinkLoading = false;
        this.submitted = true;
        if (res.statusCode === 200) {
          this.toastr.success(res.message || 'Reset link sent!');
        } else {
          this.toastr.error(res.message || 'Failed to send reset link.');
        }
      },
      error: (err) => {
        this.sendResetLinkLoading = false;
        const msg = err.error?.message || 'Something went wrong';
        this.toastr.error(msg);
      }
    });
  }

  toLogin() {
    this.router.navigate(['/login']);
  }

}
