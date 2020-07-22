import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MoneyService } from '../money.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router, NavigationExtras } from '@angular/router';
import { AppService } from '../../../app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'personal-assistant-returnings',
  templateUrl: './returnings.component.html',
  styleUrls: ['./returnings.component.scss']
})

export class ReturningsComponent implements OnInit {
  returnings: Array<any>;
  gridCols: number;

  constructor(
    public _moneyService: MoneyService,
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
    private _appService: AppService,
    private _domSanitizer: DomSanitizer,
    private _dialog: MatDialog
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
    this._moneyService.getReturnings().subscribe((response) => {
      // console.log(response);
      this.returnings = response;
      this.returnings.forEach((returning) => {
        returning.expectedReturnDate = this._appService.formatDate(returning.expectedReturnDate);
        returning['whatsAppUrl'] = this._domSanitizer.bypassSecurityTrustResourceUrl('whatsapp://send?abid=+919482153795&text=Dear+' + returning.person.replace(" ", "+") + '%2C+This+is+a+reminder+to+the+borrowings+of+Rs.+' + returning.amount + '+due+on+dated+' + returning.expectedReturnDate + '.+Kindly+return+the+amount+on+or+before+the+due+date.');
        returning['smsUrl'] = this._domSanitizer.bypassSecurityTrustResourceUrl('sms://+919482153795?body=Dear+' + returning.person.replace(" ", "+") + '%2C+This+is+a+reminder+to+the+borrowings+of+Rs.+' + returning.amount + '+due+on+dated+' + returning.expectedReturnDate + '.+Kindly+return+the+amount+on+or+before+the+due+date.');
        // console.log(returning['smsUrl']);
      })
    });
  }


  onEdit(returning) {
    const extra: NavigationExtras = {
      state: { returning }
    }
    this._router.navigate(['returnings/returning', returning.id], extra);
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
        this._moneyService.deleteReturning(returning).subscribe((response) => {
          console.log(response);
          this.ngOnInit();
          this._appService.actionMessage({ title: 'Success!', text: 'Returning information deleted successfully.' });
        }, (error) => {
          if (error.statusText !== 'Unauthorized' || error.error.error !== 'Auth token is expired') {
            this._appService.actionMessage({ title: 'Error!', text: 'Oops. Something went wrong. Unable to delete information.' });
          }
        });
      }
    });
  }


}
