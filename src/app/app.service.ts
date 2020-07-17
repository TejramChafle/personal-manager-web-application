import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  constructor( private _snackBar: MatSnackBar, private _router: Router) { }

  public actionMessage(message: { title: string, text: string }) {
    this._snackBar.open(message.title, message.text, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  public handleError(error) {
    console.log(error);
    // this._router.navigate(['/login']);
  }
}
