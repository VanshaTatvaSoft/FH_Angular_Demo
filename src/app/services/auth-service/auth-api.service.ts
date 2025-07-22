import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../models/response.model';
import { environment } from '../../../environments/environment.development';
import { SignUpInterface } from '../../models/sign-up.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private apiUri = `${environment.apiBaseUrl}/Auth`;
  constructor(private http: HttpClient) {}

  sendResetPasswordEmail(
    email: string,
    username: string
  ): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.apiUri}/forgot-password`, {
      params: {
        email,
        username,
      },
    });
  }

  login(data: {
    userName: string;
    password: string;
    rememberMe: boolean;
  }): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUri}/login`, data, {
      withCredentials: true,
    });
  }

  getRememberMe(): boolean {
    const match = document.cookie.match(/(?:^| )DemoRememberMe=([^;]*)/);
    return match ? match[1] === 'true' : false;
  }

  validateAccessToken(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUri}/validate`,
      {
        withCredentials: true,
      }
    );
  }

  refreshToken(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>(
      `${this.apiUri}/refresh-token`,
      {
        withCredentials: true,
      }
    );
  }

  checkUserExists(userName: string): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      `${this.apiUri}/check-user?userName=${encodeURIComponent(userName)}`
    );
  }

  logout(): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      `${this.apiUri}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  signUpUser(userData: SignUpInterface): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUri}/signup`, userData);
  }

}
