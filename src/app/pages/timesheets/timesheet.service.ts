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

export class TimesheetService {
  constructor(private _http: HttpClient, private _appService: AppService, private _authService: AuthService) {
  }

  public saveTimesheet(data): Observable<any> {
    data.user = this._authService.user.localId;
    return this._http.post(environment.API_URL + 'timesheets.json?', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }


  public getTimesheets(): Observable<any> {
    let filter = 'orderBy="user"&equalTo="' + this._authService.user.localId + '"';
    return this._http.get(environment.API_URL + 'timesheets.json?' + filter).pipe(
      map((response) => {
        console.log(response);
        let result: Array<any> = [];
        for (let key in response) {
          let task: any = {
            date: response[key]['date'],
            description: response[key]['description'],
            tasks: response[key]['tasks'],
            createdDate: response[key]['createdDate'],
            updatedDate: response[key]['updatedDate'],
            user: response[key]['user'],
            id: key
          }
          result.push(task);
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
  public deleteTimesheet(data): Observable<any> {
    return this._http.delete(environment.API_URL + 'timesheets/' + data.id + '.json?').pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }

  // UPDATE
  public updateTimesheet(data): Observable<any> {
    data.user = this._authService.user.localId;
    return this._http.put(environment.API_URL + 'timesheets/' + data.id + '.json?', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }
}
