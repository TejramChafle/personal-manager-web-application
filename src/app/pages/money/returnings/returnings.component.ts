import { Component, OnInit } from '@angular/core';
import { MoneyService } from '../money.service';

@Component({
  selector: 'personal-assistant-returnings',
  templateUrl: './returnings.component.html',
  styleUrls: ['./returnings.component.scss']
})

export class ReturningsComponent implements OnInit {
  returnings: Array<any>;

  constructor(public _moneyService: MoneyService) {
    console.log(_moneyService.paymentMethods);
  }

  ngOnInit() {
    this._moneyService.getReturnings().subscribe((responsive) => {
      console.log(responsive);
      this.returnings = responsive;
    });
  }
}
