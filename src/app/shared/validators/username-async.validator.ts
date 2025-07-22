import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { timer, switchMap, map } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { ResponseModel } from "../../models/response.model";

export function UsernameAvailableValidator(): AsyncValidatorFn {
  const http = inject(HttpClient);
  const apiUrl = `${environment.apiBaseUrl}/auth/check-user`;

  return (control: AbstractControl) => {
    debugger;
    if (!control.value) return timer(0).pipe(map(() => null)); // still return observable
    console.log("Checking username availability for:", control.value);
    return timer(500).pipe( // debounce for 500ms
      switchMap(() =>
        http.get<ResponseModel>(`${apiUrl}?userName=${control.value}`)
      ),
      map(res => (res.statusCode == 200 ? { usernameTaken: true } : null))
    );
  };
}
