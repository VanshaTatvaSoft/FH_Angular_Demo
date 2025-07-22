import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../../models/response.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUri = `${environment.apiBaseUrl}/Auth`;

  constructor(private http: HttpClient) {}

  login(data: { userName: string; password: string; rememberMe: boolean }): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUri}/login`, data, {
      withCredentials: true,
    });
  }

  getRememberMe(): boolean {
    const match = document.cookie.match(/(?:^| )DemoRememberMe=([^;]*)/);
    return match ? match[1] === 'true' : false;
  }

  validateAndRefreshToken(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.apiUri}/validate-refresh-token`, {
      withCredentials: true,
    })
  }

  checkUserExists(userName: string): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      `${this.apiUri}/check-user?userName=${encodeURIComponent(userName)}`
    );
  }

  logout(): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUri}/logout`, {}, {
      withCredentials: true,
    });
  }

}
