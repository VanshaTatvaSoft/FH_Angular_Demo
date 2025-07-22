import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { TogglePassword } from '../../directives/toggle-password';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [FormsModule,RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatIconModule, MatIconModule, TogglePassword, CommonModule]
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);
  resetForm: FormGroup;
  submitted = false;
  resetLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get newPassword() { return this.resetForm.get('newPassword'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }
  get isFormValid() { return this.resetForm.valid; }

  // Use the AuthServiceService validation
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const errors = this.authService.getPasswordErrors(control.value || '');
    return errors.length ? { passwordErrors: errors } : null;
  }

  // Match validator for FormGroup
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (!this.isFormValid) return;
    this.resetLoading = true;
    setTimeout(() => {
      this.resetLoading = false;
      this.submitted = true;
      // Call API here for password reset with token if needed
    }, 1500);
  }

  toLogin() {
    this.router.navigate(['/login']);
  }
}
