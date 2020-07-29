import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { TimesheetComponent } from './timesheet/timesheet.component';

import { TimesheetService } from './timesheet.service';

@Component({
  selector: 'personal-manager-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss']
})

export class TimesheetsComponent implements OnInit {

  timesheets: Array<any>;
  loading = false;
  gridCols: number;

  constructor(
    private _dialog: MatDialog,
    private _timesheetService: TimesheetService,
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
    this._timesheetService.getTimesheets().subscribe((response) => {
      console.log(response);
      this.timesheets = [];
      response.forEach(sheet => {
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
        console.log(sheet);
        this.timesheets.push(sheet);
      });
      // this.timesheets = response;
    }, (error) => {
      if (error.status == 401 && error.statusText == "Unauthorized") {
      } else {
        this._appService.actionMessage({ title: 'Error!', text: 'Failed to get timesheets information' });
      }
      console.log(error);
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
        this._timesheetService.deleteTimesheet(timesheet).subscribe((response) => {
          console.log(response);
          snak.dismiss();

          // Refresh the list once deleted
          if (response == null) {
            this.ngOnInit();
          }
        }, (error) => {
          if (error.status == 401 && error.statusText == "Unauthorized") {
          } else {
            this._appService.actionMessage({ title: 'Error!', text: 'Failed to delete timesheet information' });
          }
          console.log(error);
          snak.dismiss();
        })
      }
    })
  }

  editTimesheet(timesheet, field) {
    timesheet[field] = !timesheet[field];
    let data: any = { ...timesheet };
    data.updatedDate = new Date();
    let snak = this._snakBar.open('Updating, Please wait...', 'Close');
    this._timesheetService.updateTimesheet(data).subscribe((response) => {
      console.log(response);
      timesheet = response;
      snak.dismiss();
    }, (error) => {
      if (error.status == 401 && error.statusText == "Unauthorized") {
      } else {
        this._appService.actionMessage({ title: 'Error!', text: 'Failed to get timesheets information' });
      }
      console.log(error);
      snak.dismiss();
    });
  }

}
