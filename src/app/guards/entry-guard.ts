import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthApiService } from '../services/auth-service/auth-api.service';

export const entryGuard: CanActivateFn = () => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  return authService.validateAccessToken().pipe(
    switchMap((res) => {
      if (res.isValid && !res.isExpired) {
        router.navigateByUrl('/dashboard');
        return of(false);
      }
      if (res.isExpired && res.isRememberMe) {
        return authService.refreshToken().pipe(
          map(() => {
            router.navigateByUrl('/dashboard');
            return false;
          }),
          catchError(() => of(true))
        );
      }
      return of(true);
    }),
    catchError(() => of(true))
  );
};
