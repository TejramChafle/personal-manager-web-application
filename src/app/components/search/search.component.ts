import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { MoneyService } from 'src/app/pages/money/money.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'personal-manager-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  id
  loading = false;
  constacts: any = {};

  constructor(
    private _formBuilder: FormBuilder,
    public _moneyService: MoneyService,
    private _appService: AppService,
    private _authService: AuthService,
    private _matRef: MatDialogRef<SearchComponent>,
    @Inject(MAT_DIALOG_DATA) public formdata: any) {

    // Initialize the form
    this.searchForm = this._formBuilder.group({
      type: new FormControl(),
      amount: new FormControl(),
      date: new FormControl(),
      person: new FormControl(),
      purpose: new FormControl(),
      expectedReturnDate: new FormControl(),
      paymentMethod: new FormControl()
    });

    // FETCH THE routing information
    if (this.formdata) {
      this.searchForm.patchValue({
        type: this.formdata.type,
        amount: this.formdata.amount,
        date: this.formdata.date,
        person: this.formdata.person,
        purpose: this.formdata.purpose,
        expectedReturnDate: this.formdata.expectedReturnDate,
        paymentMethod: this.formdata.paymentMethod
      });
      console.log(window.history.state);
    }
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    // console.log(form.value.date);
    this.loading = true;
    const data = {
      ...form.value,
      user: this._authService.user.localId
    };
    // Close the search form
    this._matRef.close({ ...data });
  }

  // UPDATE
  updateReturning(param) {
    param.id = this.id;
    param.updatedDate = new Date();

    this._moneyService.updateReturning(param).subscribe((response) => {
      this.loading = false;
      if (response) {
        this._appService.actionMessage({ title: 'Success!', text: 'Returning informaton updated successfully.' });
        // GO BACK to the previous page
        window.history.go(-1);
      }
    }, (error) => {
      if (error.statusText !== 'Unauthorized' || error.error.error !== 'Auth token is expired') {
        this._appService.actionMessage({ title: 'Error!', text: 'Oops. Something went wrong. Unable to update information.' });
      }
      this.loading = false;
    });
  }
}
