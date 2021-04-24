import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'personal-manager-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TimesheetsComponent implements OnInit {

  timesheets: Array<any>;
  loading = false;
  gridCols: number;

  constructor(
    private _dialog: MatDialog,
    private _httpService: HttpService,
    private _appService: AppService,
    private _breakpointObserver: BreakpointObserver,
    private _snakBar: MatSnackBar
  ) {
    let breakpoint = { ...Breakpoints };
    _breakpointObserver.observe(
      Object.values(breakpoint)
    ).subscribe(result => {
      for (let device in Breakpoints) {
        if (_breakpointObserver.isMatched(Breakpoints[device]) && (device == 'XSmall')) {
          this.gridCols = 1;
          break;
        } else if (_breakpointObserver.isMatched(Breakpoints[device]) && (device == 'Handset')) {
          this.gridCols = 2;
          break;
        } else if (_breakpointObserver.isMatched(Breakpoints[device]) && (device == 'TabletPortrait')) {
          this.gridCols = 2;
          break;
        } else {
          this.gridCols = 3;
        }
      }
    });
  }

  ngOnInit() {
    const params = { order: 'desc', page: 1, limit: 10 };
    this._httpService.getRecords('timesheets', params).subscribe((response) => {
      console.log(response);
      this.timesheets = [];
      response.docs.forEach(sheet => {
        var hours = 0, minutes = 0, days = 0;
        sheet.tasks.forEach(task => {
          if (task.schedule) {
            task.time = this._appService.timeDifference(task.schedule);
            days += task.time.days ? parseInt(task.time.days) : 0;
            hours += task.time.hours ? parseInt(task.time.hours) : 0;
            minutes += task.time.minutes ? parseInt(task.time.minutes) : 0;
          };
        });
        sheet.time = { days: days, hours: hours, minutes: minutes };
        this.timesheets.push(sheet);
      })
    }, (error) => {
      console.log(error);
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to get timesheets.' });
    });
  }


  openTimesheet(timesheet?: any) {
    let dialogRef = this._dialog.open(TimesheetComponent, {
      minWidth: '350px',
      data: { timesheet }
    });

    dialogRef.afterClosed().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        this.ngOnInit();
      }
    })
  }

  onDelete(timesheet) {
    let dialogRef = this._dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        title: 'Delete?',
        message: 'Are you sure you want to delete this timesheet record?',
        okayText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if (response) {
        let snak = this._snakBar.open('Deleting, Please wait...', 'Close');
        this._httpService.deleteRecord('timesheets', timesheet).subscribe((response) => {
          console.log(response);
          if (response.result) {
            this._appService.actionMessage({ title: 'Success!', text: 'Expenditures added successfully.' });
          }
          this.ngOnInit();
          snak.dismiss();
        }, (error) => {
          console.log(error);
          snak.dismiss();
          this._appService.actionMessage({ title: 'Error!', text: 'Failed to add expenditure item.' });
        });
      }
    })
  }

  editTimesheet(timesheet, field) {
    timesheet[field] = !timesheet[field];
    let data: any = { ...timesheet };
    data.updatedDate = new Date();
    let snak = this._snakBar.open('Updating, Please wait...', 'Close');
    this._httpService.updateRecord('timesheets', data).subscribe((response) => {
      console.log(response);
      if (response.result) {
        this._appService.actionMessage({ title: 'Success!', text: 'Timesheet updated successfully.' });
      }
      this.ngOnInit();
      snak.dismiss();
    }, (error) => {
      console.log(error);
      snak.dismiss();
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to update timesheet.' });
    });
  }

}
