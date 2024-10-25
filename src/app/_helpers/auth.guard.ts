import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/_services';
import { SidebarService } from '@app/_components/_shared/sidebar/sidebar.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private sidebarService: SidebarService,
  ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        if (user) {
            /* Kiểm tra quyền truy cập route của tài khoản */
            const currentUrl = state.url; // URL hiện tại
            const menu = this.sidebarService.getMenuFromLocalStorage().filter(item => item.link !== '' && currentUrl.includes(item.link));
            // Nếu không tìm thấy menu tương ứng và hiện tại không phải trang chủ hoặc setting
            if (menu.length === 0 && currentUrl !== '/' && currentUrl !== '/setting' && currentUrl !== '/changepass') {
              this.router.navigate(['/']);  // Điều hướng về trang chủ
              return false;  // Không cho phép truy cập
            }
            /* End */

            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
