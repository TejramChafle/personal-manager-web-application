import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenditureComponent } from './expenditure/expenditure.component';
import { AppService } from '../../../app.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { HttpService } from 'src/app/http.service';


@Component({
  selector: 'personal-manager-expenditures',
  templateUrl: './expenditures.component.html',
  styleUrls: ['./expenditures.component.scss']
})

export class ExpendituresComponent implements OnInit {
  expenditures: Array<any>;
  loading = false;
  gridCols: number;

  constructor(
    private _dialog: MatDialog,
    private _appService: AppService,
    private _breakpointObserver: BreakpointObserver,
    private _snakBar: MatSnackBar,
    private _httpService: HttpService) {
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
    this._httpService.getRecords('expenditures', params).subscribe((response) => {
      console.log(response);
      this.expenditures = response.docs;
    }, (error) => {
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to get expenditure information' });
      console.log(error);
    });
  }


  openExpenditure(expenditure?: any) {
    let dialogRef = this._dialog.open(ExpenditureComponent, {
      minWidth: '350px',
      data: { expenditure: expenditure }
    });

    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if (response) {
        this.ngOnInit();
      }
    })
  }


  onDelete(expenditure) {

    let dialogRef = this._dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        title: 'Delete?',
        message: 'Are you sure you want to delete this expenditure?',
        okayText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if (response) {
        let snak = this._snakBar.open('Deleting, Please wait...', 'Close');
        this._httpService.deleteRecord('expenditures', expenditure).subscribe((response) => {
          console.log(response);
          this.ngOnInit();
          snak.dismiss();
          this._appService.actionMessage({ title: 'Success!', text: 'Expenditure information deleted successfully.' });
        }, (error) => {
          this._appService.actionMessage({ title: 'Error!', text: 'Failed to delete expenditure information' });
          console.log(error);
          snak.dismiss();
        });
      }
    })
  }
}
