import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoneyService } from '../money.service';
import { Router, NavigationExtras } from '@angular/router';
import { AppService } from '../../../app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/http.service';
import { ReturningComponent } from './returning/returning.component';

@Component({
  selector: 'personal-manager-returnings',
  templateUrl: './returnings.component.html',
  styleUrls: ['./returnings.component.scss']
})

export class ReturningsComponent implements OnInit, OnDestroy {
  returnings: Array<any>;
  subscription: Subscription;
  page: number;
  isError: boolean;

  constructor(
    public _moneyService: MoneyService,
    private _router: Router,
    public _appService: AppService,
    private _domSanitizer: DomSanitizer,
    private _dialog: MatDialog,
    private _httpService: HttpService
  ) {
    this.page = 1;
  }

  ngOnInit() {
    const params = { order: 'desc', page: this.page, limit: 100 };
    // Initialise the page with default preference and get first 10 records
    this.getRecords(params);
    
    // Subscribe to user actions like search, filter and sort
    this.subscription = this._appService.dialogRef.subscribe((response) => {
      console.log('dialogRef returnings.component', response);
      if (response.data) {
        this.getRecords({...params, ...response.data});
      }
    });
  }

  getRecords(params) {
    this._httpService.getRecords('returnings', params).subscribe((response) => {
      // console.log(response);
      response.docs.forEach((returning) => {
        returning.expectedReturnDateInWords = this._appService.formatDate(returning.expectedReturnDate);
        returning['whatsAppUrl'] = this._domSanitizer.bypassSecurityTrustResourceUrl('whatsapp://send?abid=+919482153795&text=Dear+' + returning.person.replace(" ", "+") + '%2C+This+is+a+reminder+to+the+borrowings+of+Rs.+' + returning.amount + '+due+on+dated+' + returning.expectedReturnDateInWords + '.+Kindly+return+the+amount+on+or+before+the+due+date.');
        returning['smsUrl'] = this._domSanitizer.bypassSecurityTrustResourceUrl('sms://+919482153795?body=Dear ' + returning.person+ '%2C This is a reminder to the borrowings of Rs. ' + returning.amount + ' due on dated ' + returning.expectedReturnDateInWords + '. Kindly return the amount on or before the due date.');
      });
      // Adjust purchase array based on page number.
      if (response.page > 1) {
        this.returnings = this.returnings.concat(response.docs);
      } else {
        this.returnings = response.docs;
      }
      this.isError = false;
      // console.log('this.returnings', this.returnings);
    }, (error) => {
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to get returnings information' });
      // console.log(error);
      this.isError = true;
    });
  }


  onEdit(returning) {
    const extra: NavigationExtras = {
      state: { returning }
    }
    this._router.navigate(['money/returnings/returning', returning.id], extra);
  }

  onDelete(returning) {
    let dialogRef = this._dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        title: 'Delete?',
        message: 'Are you sure you want to delete this returning?',
        okayText: 'Yes',
        cancelText: 'No'
      }
    });
    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if (response) {
        this._httpService.deleteRecord('returnings', returning).subscribe((response) => {
          console.log(response);
          this.page = 1;
          this.returnings = null;
          this.ngOnInit();
          this._appService.actionMessage({ title: 'Success!', text: 'Returning information deleted successfully.' });
        }, (error) => {
          this._appService.actionMessage({ title: 'Error!', text: 'Oops. Something went wrong. Unable to delete information.' });
          console.log(error);
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openReturning(returning?: any) {
    let dialogRef = this._dialog.open(ReturningComponent, {
      minWidth: '350px',
      data: { ...returning }
    });

    dialogRef.afterClosed().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        this.page = 1;
        this.returnings = null;
        this.ngOnInit();
      }
    })
  }
}
