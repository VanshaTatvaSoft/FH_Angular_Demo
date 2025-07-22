import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private apiUri = `http://localhost:5253/api/Auth`;
constructor(private http: HttpClient) { }

sendResetPasswordEmail(email: string, username: string): Observable<ResponseModel> {
  return this.http.get<ResponseModel>(`${this.apiUri}/forgot-password`, {
    params: {
      email,
      username
    }
  });
}
}
