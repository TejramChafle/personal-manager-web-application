import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MoneyService {
  paymentMethods: Array<string>;

  constructor(private _http: HttpClient) {
    this.paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Google Pay', 'PayTM', 'Other'];
  }

  public saveReturning(data): Observable<any> {
    return this._http.post(environment.API_URL + 'returnings.json', data).pipe(
      catchError((error) => {
        return throwError(error);
      })
    )
  }


  public getReturnings(): Observable<any> {
    return this._http.get(environment.API_URL + 'returnings.json').pipe(
      catchError((error) => {
        return throwError(error);
      })
    )
  }
}
