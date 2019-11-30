import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../auth/authservice.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthserviceService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        const currentUser = this.authService.user;
        if (currentUser && this.authService.authToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: this.authService.authToken
                }
            });
        }

        return next.handle(request);
    }
}