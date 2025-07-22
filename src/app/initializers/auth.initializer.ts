import { inject } from '@angular/core';
import { LoginService } from '../services/login-service/login-service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from '../services/auth-service/auth-api.service';

export function initAuth(): () => Promise<void> {
  return async () => {
    debugger
    const loginService = inject(AuthApiService);
    const router = inject(Router);

    // if (!loginService.getRememberMe()) return;

    try {
      const res = await firstValueFrom(loginService.validateAndRefreshToken());
      if (res.statusCode === 200) {
        router.navigate(['/dashboard']);
      } else {
        router.navigate(['/login']);
      }
    } catch {
      router.navigate(['/login']);
    }
  };
}
