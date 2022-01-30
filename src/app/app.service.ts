import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { pages, paymentMethods, purposeTypes, taskLabels, sortOptions } from 'src/app/app.constant';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  
  dialogRef = new EventEmitter();
  searchFieldsEnabler = {
    date: [pages.EXPENDITURE, pages.RETURNING, pages.REMINDER, pages.TASK, pages.GROCERY, pages.LEARNING, pages.TIMESHEET],
    type: [pages.RETURNING],
    amount: [pages.EXPENDITURE, pages.RETURNING],
    person: [pages.RETURNING],
    expectedReturnDate: [pages.RETURNING],
    paymentMethod: [pages.EXPENDITURE, pages.RETURNING],
    paymentStatus: [pages.EXPENDITURE],
    purpose: [pages.EXPENDITURE, pages.GROCERY],
    place: [pages.EXPENDITURE, pages.GROCERY]
  };
  paymentMethods: Array<string> = paymentMethods;
  purposeTypes: Array<string> = purposeTypes;
  taskLabels = taskLabels;
  sortOptions = sortOptions;

  labels = [
    { name: 'Mobile', color: '#82caaf', isChecked: false },
    { name: 'Frontend', color: '#b676b1', isChecked: false },
    { name: 'Backend', color: '#194a8d', isChecked: false },
    { name: 'API', color: '#fecf6a', isChecked: false },
    { name: 'Learning', color: '#75c0e0', isChecked: false },
    { name: 'Office', color: '#75c0e0', isChecked: false },
    { name: 'Help', color: '#b676b1', isChecked: false },
    { name: 'Other', color: '#8F3985', isChecked: false }
  ];
  
  constructor(
    private _snackBar: MatSnackBar, 
    private _router: Router) {
  }

  public actionMessage(message: { title: string, text: string }) {
    this._snackBar.open(message.text, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  public handleError(error) {
    if (error.status === 401 && error.statusText == 'Unauthorized') {
      this.actionMessage({ text: 'Login expired, Please login again.', title: 'Close' });
      localStorage.clear();
      this._router.navigateByUrl('login', { state: { url: location.pathname } });
    } else {
      console.log(error);
    }
  }


  public formatDate(jsDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = new Date(jsDate);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return day + ' ' + months[month] + ', ' + year;
  }

  public inputDate(date) {
    let day = date.getDate();
    let month = date.getMonth();
    const year = date.getFullYear();
    month++;
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return year + '-' + month + '-' + day;
  }


  // Calculate the time difference between two dates in Days, Hours and Minutes 
  timeDifference(time) {
    var startTime;
    var endTime;
    if (time && time.startDate) {
      let date = new Date(time.startDate);
      if (time.startTime) {
        date.setHours(time.startTime.split(':')[0]);
        date.setMinutes(time.startTime.split(':')[1]);
      }
      startTime = date.getTime();
    }

    if (time && time.dueDate) {
      let date = new Date(time.dueDate);
      if (time.endTime) {
        date.setHours(time.endTime.split(':')[0]);
        date.setMinutes(time.endTime.split(':')[1]);
      }
      endTime = date.getTime();
    }

    let days = (endTime - startTime) / (1000 * 3600 * 24);
    let total_hrs = (endTime - startTime) / (1000 * 60 * 60);
    let mins = ((endTime - startTime) % (1000 * 60 * 60)) / (1000 * 60);
    let hrs = total_hrs % 24;
    return {
      days: days ? days.toFixed() : null,
      hours: hrs ? hrs.toFixed() : null,
      minutes: mins ? mins : (hrs ? 0 : null)
    }
  }
}
