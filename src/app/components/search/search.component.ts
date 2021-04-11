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
  enabledFields: any = {};
  formControls = ['type', 'amount', 'date', 'person', 'purpose', 'expectedReturnDate', 'paymentMethod', 'paymentStatus', 'place'];

  constructor(
    private _formBuilder: FormBuilder,
    public _moneyService: MoneyService,
    private _appService: AppService,
    private _authService: AuthService,
    private _matRef: MatDialogRef<SearchComponent>,
    @Inject(MAT_DIALOG_DATA) public formdata: any) {

    // Initialize the form
    let fields = {};
    this.formControls.forEach((control)=> {
      fields[control] = new FormControl();
    });
    this.searchForm = this._formBuilder.group(fields);

    // FETCH THE routing information
    if (this.formdata) {
      this.formControls.forEach((control) => {
        fields[control] = this.formdata[control];
      });
      this.searchForm.patchValue(fields);
      console.log(window.history.state);
    }

    // Find the path and page name
    const path = window.location.pathname.split('/');
    const page = path[path.length - 1];

    // Filter out the enabled fields for input
    this.formControls.forEach((control) => {
      fields[control] = this._appService.searchFieldsEnabler[control].indexOf(page) < 0 ? false : true;
    });
    this.enabledFields = { ...fields };
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    // console.log(form.value);
    let searchfor = {};
    for (let key in form.value) {
      if (form.value[key]) {
        searchfor[key] = form.value[key];
      }
    }
    const data = {
      ...searchfor,
      user: this._authService.user.localId
    };
    // Close the search form
    this._matRef.close({ ...data });
  }
}
