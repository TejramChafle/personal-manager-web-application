import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenditureComponent } from './expenditure/expenditure.component';
import { AppService } from '../../../app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { HttpService } from 'src/app/http.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'personal-manager-expenditures',
  templateUrl: './expenditures.component.html',
  styleUrls: ['./expenditures.component.scss']
})

export class ExpendituresComponent implements OnInit {
  expenditures: Array<any>;
  loading = false;
  subscription: Subscription;
  isError: boolean;

  constructor(
    private _dialog: MatDialog,
    public _appService: AppService,
    private _snakBar: MatSnackBar,
    private _httpService: HttpService) {
  }

  ngOnInit() {
    const params = { order: 'desc', page: 1, limit: 100 };
    // Initialise the page with default preference and get first 10 records
    this.getRecords(params);
    
    // Subscribe to user actions like search, filter and sort
    this.subscription = this._appService.dialogRef.subscribe((response) => {
      console.log('dialogRef expenditure.component', response);
      if (response.data) {
        this.getRecords({...params, ...response.data});
      }
    });
  }

  getRecords(params) {
    this._httpService.getRecords('expenditures', params).subscribe((response) => {
      console.log(response);
      // Adjust purchase array based on page number.
      if (response.page > 1) {
        this.expenditures = this.expenditures.concat(response.docs);
      } else {
        this.expenditures = response.docs;
      }
      this.isError = false;
      // this.expenditures = response.docs;
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
