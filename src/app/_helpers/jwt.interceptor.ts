import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, async } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authenticationService.userValue;
        const user_token = user?.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        if (user_token && isApiUrl) {
            request = request.clone({
                // setHeaders: {
                //     Authorization: `Bearer ${user.token}`
                // }, 
                withCredentials: true
            });
        }

        return next.handle(request);
    }

}