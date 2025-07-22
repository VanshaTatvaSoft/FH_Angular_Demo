import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login-service/login-service';
import { ToastrService } from 'ngx-toastr';
import { CustomInput } from '../../shared/components/custom-input/custom-input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    RouterLink,
    CustomInput,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [false],
    });

    this.loginForm.get('userName')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((userName: string) => {
        if (!userName) return of(null);
        return this.loginService.checkUserExists(userName).pipe(
          catchError((err) => {
            if (err.status === 404) {
              this.loginForm.get('userName')?.setErrors({ notFound: true });
            }
            return of(null);
          })
        );
      })
    ).subscribe((res) => {
      const control = this.loginForm.get('userName');
      if (res?.statusCode === 200) {
        control?.setErrors(null);
      }
    });
  }

  onSubmit(): void {
    debugger;
    if (this.loginForm.invalid) return;

    this.loginService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.toastr.success('Login successful!');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(res.message || 'Login failed. Please try again.');
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Something went wrong';
        this.toastr.error(msg);
      },
    });
  }

  get userNameControl(): FormControl{
    return this.loginForm.get('userName') as FormControl;
  }
  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

}
