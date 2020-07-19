import { Component, OnInit } from '@angular/core';
import { MoneyService } from '../money.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router, NavigationExtras } from '@angular/router';
import { AppService } from '../../../app.service';

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
    private _appService: AppService
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
    this._moneyService.getReturnings().subscribe((responsive) => {
      console.log(responsive);
      this.returnings = responsive;
    });
  }


  onEdit(returning) {
    const extra: NavigationExtras = {
      state: { returning }
    }
    this._router.navigate(['returnings/returning', returning.id], extra);
  }

  onDelete(returning) {
    if (confirm('Are you sure you want to delete?')) {
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
  }


}
