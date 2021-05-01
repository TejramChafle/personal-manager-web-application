import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroceryComponent } from './grocery/grocery.component';
import { AppService } from '../../app.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { ManageItemComponent } from './manage-item/manage-item.component';
import { HttpService } from 'src/app/http.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'personal-manager-groceries',
  templateUrl: './groceries.component.html',
  styleUrls: ['./groceries.component.scss']
})

export class GroceriesComponent implements OnInit, OnDestroy {
  purchases: Array<any>;
  loading = false;
  gridCols: number;
  page: number;
  subscription: Subscription;

  constructor(
    private _dialog: MatDialog,
    private _appService: AppService,
    private _breakpointObserver: BreakpointObserver,
    private _snakBar: MatSnackBar,
    private _httpService: HttpService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService) {
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

    // Set the page to 1
    this.page = 1
  }

  ngOnInit() {
    const params = { order: 'desc', page: 1, limit: 10 };
    this.getRecords(params);

    // On model service subsciorion
    this.subscription = this._appService.dialogRef.subscribe((response) => {
      console.log('dialogRef groceries.component', response);
      if (response.action === 'search' && response.data) {
        this.page = 1;
        const params = { order: 'desc', page: this.page, limit: 10, ...response.data };
        this.getRecords(params);
      }
    });
  }

  getRecords(params) {
    this._httpService.getRecords('purchases', params).subscribe((response) => {
      console.log(response);
      // Modify the result for item description. This will generate text from items array
      response.docs.forEach(element => {
        element.itemDescription = element.items.map((item) => { return item.name }).toString().replace(/,/g, ", ");
      });
      // Adjust purchase array based on page number.
      if (response.page > 1) {
        this.purchases = this.purchases.concat(response.docs);
      } else {
        this.purchases = response.docs;
      }
      console.log('this.purchases', this.purchases);
    }, (error) => {
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to get purchases information' });
      console.log(error);
    });
  }


  openGrocery(grocery?: any) {
    let dialogRef = this._dialog.open(GroceryComponent, {
      minWidth: '350px',
      data: { grocery }
    });

    dialogRef.afterClosed().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        this.ngOnInit();
      }
    })
  }

  onDelete(grocery) {
    let dialogRef = this._dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        title: 'Delete?',
        message: 'Are you sure you want to delete this grocery record?',
        okayText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if (response) {
        let snak = this._snakBar.open('Deleting, Please wait...', 'Close');
        this._httpService.deleteRecord('purchases', grocery).subscribe((response) => {
          console.log(response);
          this.ngOnInit();
          snak.dismiss();
          this._appService.actionMessage({ title: 'Success!', text: 'Grocery information deleted successfully.' });
        }, (error) => {
          this._appService.actionMessage({ title: 'Error!', text: 'Failed to delete grocery information' });
          console.log(error);
          snak.dismiss();
        });
      }
    })
  }


  manageItem(grocery) {
    let dialogRef = this._dialog.open(ManageItemComponent, {
      minWidth: '350px',
      data: { grocery }
    })

    dialogRef.afterClosed().subscribe((response)=> {
      console.log(response);
      if (response) {
        this.ngOnInit();
      }
    })
  }

  onScrollDown() {
    this.page = this.page + 1;
    const params = { order: 'desc', page: this.page, limit: 10 };
    this.getRecords(params);
  }

  onUp() {
    console.log('scrolled up!!');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onShare(purchase) {
    console.log('purchase', purchase);
    let href = 'whatsapp://send?abid=&text=';
    href += 'Hey, %0A' + this._authService.user.user.name + ' has shared the items list for ' + purchase.expenditure.purpose.toLowerCase() + ' at ' + purchase.expenditure.place +'. %0A';
    href += 'Items list (' + purchase.items.length + ') includes: %0A';
    purchase.items.forEach((item, key) => {
      href += ++key + '. ' + item + '%0A';
    });
    href += 'To edit or start purchasing, visit ' + window.location.href + '/' + purchase._id + '%0A';
    href += ' ';
    window.open(href, '_blank');
  }

  onCopy(purchase) {
    console.log('purchase', purchase);
    let param = {
      expenditure: {
        place: purchase.expenditure.place,
        purpose: purchase.expenditure.purpose
      },
      items: purchase.items
    }
    this.openGrocery(param);
  }

  openDetail(purchase) {
    localStorage.setItem('purchase', JSON.stringify(purchase));
    this._router.navigate(['groceries', purchase._id]);
  }
}
