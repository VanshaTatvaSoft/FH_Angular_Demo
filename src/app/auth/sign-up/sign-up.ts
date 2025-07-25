
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RoleOptions } from '../../shared/constants/select-options.constant.js'
import { AuthApiService } from '../../services/auth-service/auth-api.service';
import { ToastrService } from 'ngx-toastr';
import { UsernameAvailableValidator } from '../../shared/validators/username-async.validator';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CustomInput, RouterLink, MatFormFieldModule, MatInputModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  signUpForm!: FormGroup;
  roles = RoleOptions;
  signUpService = inject(AuthApiService);
  router = inject(Router)
  toastr = inject(ToastrService);
  formSummaryError = signal<string>("");

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      userName: ['', {validators:[Validators.required], asyncValidators: [UsernameAvailableValidator()], updateOn: 'blur'}],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]]
    })
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) return;
    const { userName, firstName, lastName, role, emailAddress } = this.signUpForm.value;
    this.signUpService.signUpUser(this.signUpForm.value).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Sign Up Successful');
        this.router.navigate(['/login']);
        console.log('Sign Up Succes:', res);
      },
      error: (err) => {
        if(err.error.statusCode == 409){
          this.formSummaryError.set(err.error.message);
        }
      }
    });
    console.log('Sign Up Data:', { userName, firstName, lastName, role });
  }

  get userNameControl(): FormControl {
    return this.signUpForm.get('userName') as FormControl;
  }
  get firstNameControl(): FormControl {
    return this.signUpForm.get('firstName') as FormControl;
  }
  get lastNameControl(): FormControl {
    return this.signUpForm.get('lastName') as FormControl;
  }
  get roleControl(): FormControl {
    return this.signUpForm.get('roleId') as FormControl;
  }
  get emailControl(): FormControl {
    return this.signUpForm.get('emailAddress') as FormControl;
  }

}
