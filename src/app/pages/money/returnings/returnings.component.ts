import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoneyService } from '../money.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router, NavigationExtras } from '@angular/router';
import { AppService } from '../../../app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/http.service';
import { ReturningComponent } from './returning/returning.component';

@Component({
  selector: 'personal-assistant-returnings',
  templateUrl: './returnings.component.html',
  styleUrls: ['./returnings.component.scss']
})

export class ReturningsComponent implements OnInit, OnDestroy {
  returnings: Array<any>;
  gridCols: number;
  subscription: Subscription;
  page: number;

  constructor(
    public _moneyService: MoneyService,
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
    private _appService: AppService,
    private _domSanitizer: DomSanitizer,
    private _dialog: MatDialog,
    private _httpService: HttpService
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
    this.page = 1;
  }

  ngOnInit() {
    const params = { order: 'desc', page: this.page, limit: 10 };
    this._httpService.getRecords('returnings', params).subscribe((response) => {
      console.log(response);
      response.docs.forEach((returning) => {
        returning.expectedReturnDateInWords = this._appService.formatDate(returning.expectedReturnDate);
        returning['whatsAppUrl'] = this._domSanitizer.bypassSecurityTrustResourceUrl('whatsapp://send?abid=+919482153795&text=Dear+' + returning.person.replace(" ", "+") + '%2C+This+is+a+reminder+to+the+borrowings+of+Rs.+' + returning.amount + '+due+on+dated+' + returning.expectedReturnDateInWords + '.+Kindly+return+the+amount+on+or+before+the+due+date.');
        returning['smsUrl'] = this._domSanitizer.bypassSecurityTrustResourceUrl('sms://+919482153795?body=Dear ' + returning.person+ '%2C This is a reminder to the borrowings of Rs. ' + returning.amount + ' due on dated ' + returning.expectedReturnDateInWords + '. Kindly return the amount on or before the due date.');
        // console.log(returning['smsUrl']);
        if (this.returnings) {
          this.returnings.push(returning);
        } else {
          this.returnings = [returning]
        }
      });
      // this.returnings = response.docs;
    }, (error) => {
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to get returnings information' });
      console.log(error);
    });

    
    // On model service subsciorion
    this.subscription = this._appService.dialogRef.subscribe((response) => {
      console.log('dialogRef returnings.component', response);
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
