import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class GroceryService {

  constructor(private _http: HttpClient, private _appService: AppService, private _authService: AuthService) {

  }


  public saveGrocery(data): Observable<any> {
    data.user = this._authService.user.localId;
    return this._http.post(environment.API_URL + 'groceries.json?', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }


  public getGroceries(): Observable<any> {
    let filter = 'orderBy="user"&equalTo="' + this._authService.user.localId + '"';
    // let filter = 'orderBy="updatedDate"&orderBy="user"&equalTo="' + this._authService.user.localId + '';
    // filter += 'limitToFirst=10';
    return this._http.get(environment.API_URL + 'groceries.json?' + filter).pipe(
      map((response) => {
        let result: Array<any> = [];
        for (let key in response) {
          let returning: any = {
            payment: response[key]['payment'],
            date: response[key]['date'],
            purpose: response[key]['purpose'],
            place: response[key]['place'],
            items: response[key]['items'],
            createdDate: response[key]['createdDate'],
            user: response[key]['user'],
            id: key
          }
          result.push(returning);
        }
        return result;
      }),
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }

  // DELETE
  public deleteGrocery(data): Observable<any> {
    return this._http.delete(environment.API_URL + 'groceries/' + data.id + '.json?').pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }

  // UPDATE
  public updateGrocery(data): Observable<any> {
    data.user = this._authService.user.localId;
    return this._http.put(environment.API_URL + 'groceries/' + data.id + '.json?', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }
}
