import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, take, catchError } from 'rxjs/operators';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  auth = new BehaviorSubject<any>(null);

  constructor(private _http: HttpClient, private _appService: AppService) { }


  public login(param): Observable<any> {
    const auth = { email: param.username, password: param.password, returnSecureToken: true };
    return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.API_KEY, auth).pipe(
      tap((auth) => {
        this.auth.next(auth);
      }),
      catchError((error) => {
        return throwError(error);
      })
    )
  }

  public signup(params): Observable<any> {
    const auth = { email: params.username, password: params.password, returnSecureToken: true };
    return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.API_KEY, auth).pipe(
      tap((auth) => {
        this.auth.next(auth);
      }),
      catchError((error) => {
        return throwError(error);
      })
    )
  }

  public getUser(): Observable<any> {
    return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + environment.API_KEY, { idToken: this.user.idToken }).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }

  public updateUser(params): Observable<any> {
    const data = {
      idToken: this.user.idToken,
      displayName: params.name,
      photoUrl: params.photoUrl,
      returnSecureToken: false
    }
    return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:update?key=' + environment.API_KEY, data ).pipe(
      catchError((error) => {
        return throwError(error);
      })
    )
  }

  get user() {
    let user;
    this.auth.pipe(take(1)).subscribe((repsonse) => {
      if (repsonse) {
        localStorage.setItem('auth', JSON.stringify(repsonse));
        user = repsonse;
      } else {
        user = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null;
      }
    });
    return user;
  }

  logout() {
    localStorage.clear();
  }
}
