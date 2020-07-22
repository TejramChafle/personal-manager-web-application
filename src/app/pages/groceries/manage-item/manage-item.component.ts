import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { GroceryComponent } from '../grocery/grocery.component';

@Component({
  selector: 'personal-manager-manage-item',
  templateUrl: './manage-item.component.html',
  styleUrls: ['./manage-item.component.scss']
})

export class ManageItemComponent implements OnInit {
  @ViewChild('selectedItem', {static: true }) selectedItem; 
  isPurschasingFinished = false;

  constructor(
    private _dialogRef: MatDialogRef<ManageItemComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog) { }

  ngOnInit() {
  }

  onClose() {
    this._dialogRef.close(false);
  }

  onChangeItem(item) {
    this.isPurschasingFinished = this.selectedItem.selectedOptions.selected.length == this.data.grocery.items.length ? true : false;
  }

  onFinishedPurchase() {
    let dialogRef = this._dialog.open(ConfirmComponent, {
      data: {
        title: 'Proceed to payment?',
        message: 'Once the purchasing is complete, you can proceed to submission of payment details',
        cancelText: 'Later',
        okayText: 'Okay'
      }
    });

    dialogRef.afterClosed().subscribe((resp)=> {
      if (resp) {
        // Open grocery detail with payment options
        let dialogRef = this._dialog.open(GroceryComponent, {
          data: { grocery: this.data.grocery, isPaid: true }
        });

        dialogRef.afterClosed().subscribe((resp)=> {
          if (resp) {
            this._dialogRef.close(true);
          }
        });
      }
    })
  }
}
