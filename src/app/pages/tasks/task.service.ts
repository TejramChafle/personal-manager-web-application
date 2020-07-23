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

export class TaskService {
  public labels: Array<{ isChecked: boolean, name: string, color: string }>;
  constructor(private _http: HttpClient, private _appService: AppService, private _authService: AuthService) {
    this.labels = [ 
      { name: 'Mobile', color: '#82caaf', isChecked: false },
      { name: 'Frontend', color: '#b676b1', isChecked: false },
      { name: 'Backend', color: '#194a8d', isChecked: false },
      { name: 'API', color: '#fecf6a', isChecked: false },
      { name: 'Learning', color: '#75c0e0', isChecked: false },
      { name: 'Office', color: '#75c0e0', isChecked: false },
      { name: 'Help', color: '#b676b1', isChecked: false },
      { name: 'Other', color: '#8F3985', isChecked: false }
     ];
  }

  public saveTask(data): Observable<any> {
    data.user = this._authService.user.localId;
    return this._http.post(environment.API_URL + 'tasks.json', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }


  public getTasks(): Observable<any> {
    return this._http.get(environment.API_URL + 'tasks.json/?user=' + this._authService.user.localId).pipe(
      map((response) => {
        let result: Array<any> = [];
        for (let key in response) {
          let task: any = {
            title: response[key]['title'],
            notes: response[key]['notes'],
            labels: response[key]['labels'],
            isDone: response[key]['isDone'],
            isStarred: response[key]['isStarred'],
            isImportant: response[key]['isImportant'],
            schedule: response[key]['schedule'],
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
  public deleteTask(data): Observable<any> {
    return this._http.delete(environment.API_URL + 'tasks/' + data.id + '.json').pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }

  // UPDATE
  public updateTask(data): Observable<any> {
    data.user = this._authService.user.localId;
    return this._http.put(environment.API_URL + 'tasks/' + data.id + '.json', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }
}
