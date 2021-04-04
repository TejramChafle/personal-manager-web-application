import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Returning } from './returnings/returning.model';
import { AppService } from '../../app.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class MoneyService {
  paymentMethods: Array<string>;
  purposeTypes: Array<string>;

  constructor(private _http: HttpClient, private _appService: AppService, private _authService: AuthService) {
    this.paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Google Pay', 'PayTM', 'Other'];
    this.purposeTypes = ['Rent', 'Bike', 'Fuel', 'Grocery', 'Transportation', 'Telephone', 'Hospital', 'Insurance', 'Entertainment', 'Shopping', 'Canteen', 'Food', 'Utilities', 'Membership', 'Other'];
  }

  public saveReturning(data): Observable<any> {
    return this._http.post(environment.API_URL + 'returnings.json?', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }


  public getReturnings(): Observable<any> {
    let filter = 'orderBy="user"&equalTo="' + this._authService.user.localId + '"';
    return this._http.get(environment.API_URL + 'returnings.json?' + filter).pipe(
      map((response) => {
        let result: Array<Returning> = [];
        for (let key in response) {
          let returning: Returning = {
            type: response[key]['type'],
            amount: response[key]['amount'],
            date: response[key]['date'],
            person: response[key]['person'],
            purpose: response[key]['purpose'],
            expectedReturnDate: response[key]['expectedReturnDate'],
            paymentMethod: response[key]['paymentMethod'],
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
  public deleteReturning(data): Observable<any> {
    return this._http.delete(environment.API_URL + 'returnings/' + data.id + '.json?').pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }

  // UPDATE
  public updateReturning(data): Observable<any> {
    return this._http.put(environment.API_URL + 'returnings/' + data.id + '.json?', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }


  // SAVE EXPENDITURE
  public saveExpenditure(data): Observable<any> {
    data.user = this._authService.user.localId;
    return this._http.post(environment.API_URL + 'expenditures.json?', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }

  // GET EXPENDITURE
  public getExpenditures(): Observable<any> {
    let filter = 'orderBy="user"&equalTo="' + this._authService.user.localId + '"';
    return this._http.get(environment.API_URL + 'expenditures.json?' + filter).pipe(
      map((response) => {
        let result = [];
        for (let key in response) {
          result.push({
            id: key,
            date: response[key]['date'],
            purpose: response[key]['purpose'],
            place: response[key]['place'],
            description: response[key]['description'],
            payment: response[key]['payment'],
          })
        }
        return result;
      }),
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }

  // DELETE EXPENDITURE
  public deleteExpenditure(data): Observable<any> {
    return this._http.delete(environment.API_URL + 'expenditures/' + data.id + '.json?').pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }

  // UPDATE EXPENDITURE
  public updateExpenditure(data): Observable<any> {
    data.user = this._authService.user.localId;
    return this._http.put(environment.API_URL + 'expenditures/' + data.id + '.json?', data).pipe(
      catchError((error) => {
        this._appService.handleError(error);
        return throwError(error);
      })
    )
  }
}
