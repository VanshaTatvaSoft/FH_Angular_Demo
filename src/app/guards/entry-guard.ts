import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login-service/login-service';
import { catchError, map, of } from 'rxjs';
import { AuthApiService } from '../services/auth-service/auth-api.service';

export const entryGuard: CanActivateFn = () => {
  const loginService = inject(AuthApiService);
  const router = inject(Router);

  // if (!loginService.getRememberMe()) return;

  return loginService.validateAndRefreshToken().pipe(
    map(res => {
      debugger
      if (res.statusCode === 200) {
        router.navigateByUrl('/dashboard');
        return false;
      }
      return true;
    }),
    catchError(() => of(true))
  );
};
