import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignUpInterface } from '../models/sign-up.interface';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  http = inject(HttpClient);
  public signUpURL = 'http://localhost:5253/api/Auth/signup';

  signUpUser(userData: SignUpInterface): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.signUpURL, userData);
  }
}
