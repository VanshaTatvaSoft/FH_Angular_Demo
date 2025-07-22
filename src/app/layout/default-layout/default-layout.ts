import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { navItems } from './_nav';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MainNavbar } from './main-navbar/main-navbar';
import { SecondNavbar } from './second-navbar/second-navbar';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { AuthApiService } from '../../services/auth-service/auth-api.service';


@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    NgScrollbarModule,
    MainNavbar,
    SecondNavbar,
  ],
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.css',
})
export class DefaultLayout {
  constructor(private router: Router, private cookieService: CookieService, private loginService: AuthApiService, private toastr: ToastrService) {}

  logout() {
    this.loginService.logout().subscribe({
      next: (res) => {
        if(res.statusCode === 200) {
          this.cookieService.deleteAll();
          this.toastr.success(res.message || 'Logout successful!');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Something went wrong';
        this.toastr.error(msg);
      }
    })
  }
}
