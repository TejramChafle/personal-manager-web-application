import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppService } from './app.service';
import { AuthService } from './pages/auth/auth.service';

@Injectable({
    providedIn: 'root'
})

export class HttpService {

    constructor(
        private _http: HttpClient,
        private _appService: AppService,
        private _authService: AuthService) {
    }

    // SAVE
    public saveRecord(pathname, data): Observable<any> {
        data.createdBy = this._authService.user.user.id;
        return this._http.post(environment.API_URL + pathname, data).pipe(
            catchError((error) => {
                this._appService.handleError(error);
                return throwError(error);
            })
        )
    }

    // GET ALL
    public getRecords(pathname, data): Observable<any> {
        let filter = '?createdBy=' + this._authService.user.user.id;
        filter += '&sortOrder=' + data.order;
        filter += '&page=' + data.page;
        filter += '&limit=' + data.limit;
        return this._http.get(environment.API_URL + pathname + filter).pipe(
            map((response) => {
                return response;
            }),
            catchError((error) => {
                this._appService.handleError(error);
                return throwError(error);
            })
        )
    }

    // DELETE
    public deleteRecord(pathname, data): Observable<any> {
        return this._http.delete(environment.API_URL + pathname + '/' + data.id).pipe(
            catchError((error) => {
                this._appService.handleError(error);
                return throwError(error);
            })
        )
    }

    // UPDATE
    public updateRecord(pathname, data): Observable<any> {
        data.createdBy = this._authService.user.user.id;
        return this._http.put(environment.API_URL + pathname + '/' + data.id, data).pipe(
            catchError((error) => {
                this._appService.handleError(error);
                return throwError(error);
            })
        )
    }
}
