import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: './confirm.component.html'
})

export class ConfirmComponent {

    constructor (private _matRef: MatDialogRef<ConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: {
        title: string,
        message: string,
        cancelText?: string,
        okayText?: string
    } ) {}

    onClose(action) {
        this._matRef.close(action);
    }
}