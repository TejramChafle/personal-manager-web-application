import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  constructor( private _snackBar: MatSnackBar, private _router: Router) { }

  public actionMessage(message: { title: string, text: string }) {
    this._snackBar.open(message.text, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  public handleError(error) {
    console.log(error);
    // this._router.navigate(['/login']);
    if (error.error.error.message == 'INVALID_ID_TOKEN') {
      localStorage.clear();
      this._router.navigate(['/login']);
    } else if (error.statusText == 'Unauthorized' && error.error.error == 'Auth token is expired') {
      this.actionMessage({ text: 'Login expired, Please login again.', title: 'Close' });
      localStorage.clear();
      this._router.navigate(['/login']);
    }
  }


  public formatDate(jsDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec'];
    let date = new Date(jsDate);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return day+' '+months[month]+', '+year;
  }

  public inputDate(date) {
    const day = date.getDate();
    let month = date.getMonth();
    const year = date.getFullYear();
    month++;
    month = month<10 ? '0'+month : month;
    return year+'-'+month+'-'+day;
  }
}
