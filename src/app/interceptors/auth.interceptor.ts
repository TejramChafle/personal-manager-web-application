import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private _authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        if (!req.url.includes('auth')) {
            // bypass the authentication for purchases service if user not logged in
            // This is done to provide the user access of the purchase detail page
            if (!this._authService.user && req.url.includes('purchases')) {
                return next.handle(req);
            }
            let request = req.clone({
                // params: new HttpParams().set('auth', this._authService.user.idToken),
                setHeaders: {
                    'Authorization': 'Bearer ' + this._authService.user.token
                }
            })
            return next.handle(request);
        }
        return next.handle(req);
    }
}