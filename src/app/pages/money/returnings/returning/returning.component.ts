import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MoneyService } from '../../money.service';
import { AppService } from '../../../../app.service';
import { AuthService } from '../../../auth/auth.service'; 
import { Returning } from '../returning.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'personal-manager-returning',
  templateUrl: './returning.component.html',
  styleUrls: ['./returning.component.scss']
})

export class ReturningComponent implements OnInit {
  returningForm: FormGroup;
  id
  loading = false;
  returning: Returning;

  constructor(
    private _formBuilder: FormBuilder, 
    public _moneyService: MoneyService, 
    private _appService: AppService,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute) {

      // INITialize the form
      this.returningForm = this._formBuilder.group({
        type: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
        date: new FormControl(null, Validators.required),
        person: new FormControl(null, Validators.required),
        purpose: new FormControl(null, Validators.required),
        expectedReturnDate: new FormControl(null, Validators.required),
        paymentMethod: new FormControl(null, Validators.required)
      });

      // FETCH THE routing information
      this.id = this._activatedRoute.snapshot.paramMap.get('id');
      if (this.id) {
        this.returning = window.history.state.returning;
        this.returningForm.patchValue({
          type: this.returning.type,
          amount: this.returning.amount,
          date: this.returning.date,
          person: this.returning.person,
          purpose: this.returning.purpose,
          expectedReturnDate: this.returning.expectedReturnDate,
          paymentMethod: this.returning.paymentMethod
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
      user: this._authService.user.localId,
      // date: new Date(form.value.date),
      // expectedReturnDate: new Date(form.value.expectedReturnDate),
      createdDate: new Date()
     };

    let param: Returning = {...data};

    if (this.id) {
      this.updateReturning(param);
    } else {
      this._moneyService.saveReturning(param).subscribe((response) => {
        this.loading = false;
        if (response) {
          this._appService.actionMessage({title: 'Success!', text: 'Returning informaton saved successfully.'});
          // GO BACK to the previous page
          window.history.go(-1);
        }
      }, (error) =>{
        if (error.statusText !== 'Unauthorized' || error.error.error !== 'Auth token is expired') {
          this._appService.actionMessage({title: 'Error!', text: 'Oops. Something went wrong. Unable to save information.'});
        }
        this.loading = false;
      });
    }
  }

  // UPDATE
  updateReturning(param) {
    param.id = this.id;
    param.updatedDate = new Date();

    this._moneyService.updateReturning(param).subscribe((response) => {
      this.loading = false;
      if (response) {
        this._appService.actionMessage({title: 'Success!', text: 'Returning informaton updated successfully.'});
        // GO BACK to the previous page
        window.history.go(-1);
      }
    }, (error) =>{
      if (error.statusText !== 'Unauthorized' || error.error.error !== 'Auth token is expired') {
        this._appService.actionMessage({title: 'Error!', text: 'Oops. Something went wrong. Unable to update information.'});
      }
      this.loading = false;
    });
  }
}
