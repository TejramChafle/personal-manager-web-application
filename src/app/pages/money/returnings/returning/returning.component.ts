import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MoneyService } from '../../money.service';
import { AppService } from '../../../../app.service';

@Component({
  selector: 'personal-manager-returning',
  templateUrl: './returning.component.html',
  styleUrls: ['./returning.component.scss']
})

export class ReturningComponent implements OnInit {
  returningForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, public _moneyService: MoneyService, private _appService: AppService) {
    this.returningForm = this._formBuilder.group({
      type: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      person: new FormControl(null, Validators.required),
      purpose: new FormControl(null, Validators.required),
      expectedReturnDate: new FormControl(null, Validators.required),
      paymentMethod: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    console.log(form);
    this._moneyService.saveReturning(form).subscribe((response) => {
      if (response) {
        this._appService.actionMessage({title: 'Success!', text: 'Returning informaton saved successfully.'});
      }
    }, (error) =>{
      this._appService.actionMessage({title: 'Error!', text: 'Oops. Something went wrong. Unable to save information.'});
    });
  }
}
