import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroceryComponent } from './grocery/grocery.component';
import { GroceryService } from './grocery.service';
import { AppService } from '../../app.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { ManageItemComponent } from './manage-item/manage-item.component'
import { AddItemComponent } from './add-item/add-item.component';

@Component({
  selector: 'personal-manager-groceries',
  templateUrl: './groceries.component.html',
  styleUrls: ['./groceries.component.scss']
})

export class GroceriesComponent implements OnInit {
  groceries: Array<any>;
  loading = false;
  gridCols: number;

  constructor(
    private _dialog: MatDialog,
    private _groceryService: GroceryService,
    private _appService: AppService,
    private _breakpointObserver: BreakpointObserver,
    private _snakBar: MatSnackBar) {
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
    this._groceryService.getGroceries().subscribe((response) => {
      console.log(response);
      // SET the items descriptions from available items array
      response.forEach(element => {
        element.itemDescription = element.items.toString().replace(/,/g,", ");
      });
      this.groceries = response;
    }, (error) => {
      if (error.status == 401 && error.statusText == "Unauthorized") {
      } else {
        this._appService.actionMessage({ title: 'Error!', text: 'Failed to get expenditure information' });
      }
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
        this._groceryService.deleteGrocery(grocery).subscribe((response) => {
          console.log(response);
          snak.dismiss();

          // Refresh the list once deleted
          if (response == null) {
            this.ngOnInit();
          }
        }, (error) => {
          if (error.status == 401 && error.statusText == "Unauthorized") {
          } else {
            this._appService.actionMessage({ title: 'Error!', text: 'Failed to delete grocery information' });
          }
          console.log(error);
          snak.dismiss();
        })
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

  addItem(grocery) {
    let dialogRef = this._dialog.open(AddItemComponent, {
      minWidth: '350px',
      data: { grocery }
    })

    dialogRef.afterClosed().subscribe((response)=> {
      console.log(response);
      if (response) {
        
      }
    })
  }
}
