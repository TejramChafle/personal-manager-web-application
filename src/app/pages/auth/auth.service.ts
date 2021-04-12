import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, take, catchError } from 'rxjs/operators';
import { AppService } from '../../app.service';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  auth = new BehaviorSubject<any>(null);

  constructor(private _http: HttpClient, private _appService: AppService, private _firebaseAuth: AngularFireAuth) { }


  public login(param): Observable<any> {
    /* const auth = { email: param.username, password: param.password, returnSecureToken: true };
    return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.API_KEY, auth).pipe(
      tap((auth) => {
        console.log('auth', auth);
        this.auth.next(auth);
      }),
      catchError((error) => {
        return throwError(error);
      })
    ) */

    const auth = { email: param.username, password: param.password };
    return this._http.post(environment.API_URL + 'auth/login', auth).pipe(
      tap((auth) => {
        // console.log('auth', auth);
        this.auth.next(auth);
      }),
      catchError((error) => {
        console.log(error);
        // return throwError(error);
        this._appService.handleError(error);
        return error;
      })
    )
  }

  public signup(params): Observable<any> {
    /* const auth = { email: params.username, password: params.password, returnSecureToken: true };
    return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.API_KEY, auth).pipe(
      tap((auth) => {
        this.auth.next(auth);
      }),
      catchError((error) => {
        return throwError(error);
      })
    ) */

    const auth = { name: params.name, email: params.username, password: params.password, device: params.device };
    return this._http.post(environment.API_URL + 'auth/signup', auth).pipe(
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
    this.auth.next(null);
  }


  // signin with Google
  googleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth provider
  AuthLogin(provider) {
    return this._firebaseAuth.auth.signInWithPopup(provider)
    .then((response) => {
      
      const auth = {
        displayName: response.user.displayName,
        email: response.user.email,
        profilePicture: response.user.photoURL,
        /* expiresIn: '3600',
        refreshToken: response.credential['accessToken'], */
        ...response.credential
      };
      console.log(response, auth);
      this.auth.next(auth);
    }).catch(error => {
      console.log(error);
    })
  }

  facebookAuth() {
    
  }
}
