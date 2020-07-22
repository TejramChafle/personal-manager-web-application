import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'personal-manager-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})

export class AddItemComponent implements OnInit {
  
  constructor(private _dialogRef: MatDialogRef<AddItemComponent>) { }

  ngOnInit() {
  }

  onClose() {
    this._dialogRef.close(false);
  }

}
