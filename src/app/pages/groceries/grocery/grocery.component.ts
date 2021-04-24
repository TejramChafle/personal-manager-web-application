import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AppService } from '../../../app.service';
import { MoneyService } from '../../money/money.service';
import { HttpService } from 'src/app/http.service';

@Component({
	selector: 'personal-manager-grocery',
	templateUrl: './grocery.component.html',
	styleUrls: ['./grocery.component.scss']
})

export class GroceryComponent implements OnInit {
	groceryForm: FormGroup;
	loading = false;
	id
	today

	constructor(
		private _formBuilder: FormBuilder,
		private _dialogRef: MatDialogRef<GroceryComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _appService: AppService,
		public _moneyService: MoneyService,
		private _httpService: HttpService
	) {
		this.groceryForm = this._formBuilder.group({
			date: new FormControl(null),
			purpose: new FormControl( this.data.grocery && this.data.grocery.purpose || 'Grocery' ),
			place: new FormControl(null, Validators.required),
			items: new FormArray([], Validators.required)
		})

		if (this.data && this.data.isPaid) {
			this.groceryForm.addControl(
				'payment', new FormGroup({
					amount: new FormControl(null, Validators.required),
					status: new FormControl('Paid', Validators.required),
					method: new FormControl(null, Validators.required),
					// bill: new FormControl(null)
				})
			);
		}

		// SET min date to the input to restrict user from adding past dates
		this.today = this._appService.inputDate(new Date());
	}

	ngOnInit() {
		console.log(this.data);
		if (this.data.grocery) {
			this.id = this.data.grocery._id;
			// Populate the items
			do {
				this.onAddItem()
			} while (this.groceryForm.get('items')['controls'].length < this.data.grocery.items.length);

			// Add the payment form control since user has opted to add payment detail
			this.groceryForm.patchValue({
				date: this._appService.inputDate(new Date(this.data.grocery.expenditure.date)),
				purspose: this.data.grocery.expenditure.purpose,
				items: this.data.grocery.items,
				place: this.data.grocery.expenditure.place,
				payment: this.data.grocery.payment
			});
			console.log('this.groceryForm', this.groceryForm);
		}
	}

	onAddItem() {
		const control = new FormControl({ value: null, disabled: this.data.isPaid || false }, Validators.required);
		(<FormArray>this.groceryForm.get('items')).push(control);
	}

	onClose() {
		this._dialogRef.close(false);
	}

	removeItem(item) {
		this.groceryForm.get('items')['controls'].splice(this.groceryForm.get('items')['controls'].indexOf(item), 1);
		this.groceryForm.get('items')['value'].splice(this.groceryForm.get('items')['value'].indexOf(item), 1);
		// RESET items if all removed
		if (this.groceryForm.get('items')['controls'].length == 0) {
			this.groceryForm.get('items').reset();
		}
	}

	onSubmit(form: FormGroup) {
		this.loading = true;
		console.log(form);
		let data: any = { ...form.value };
		let items = [];
		// Trim white spaces around the items
		if (this.data.grocery && this.data.grocery.items && this.data.isPaid) {
			items = this.data.grocery.items;
		} else if (data.items && data.items.length) {
			data.items.forEach(element => {
				element = element.trim();
				items.push(element);
			});
		}
		data.items = items;
		console.log('this.id', this.id);
		if (this.id) {
			data.id = this.id;
			data.updatedDate = new Date();
			data.createdDate = this.data.grocery.createdDate;
			data.expenditure = this.data.grocery.expenditure;
			console.log('data:', data );

			this._httpService.updateRecord('purchases', data).subscribe((response) => {
				this.loading = false;
				console.log(response);
				if (response.result) {
					this._appService.actionMessage({ title: 'Success!', text: 'Grocery record created successfully.' });
					this._dialogRef.close(true);
				}
			}, (error) => {
				console.log(error);
				this.loading = false;
				this._appService.actionMessage({ title: 'Error!', text: 'Failed to add purchase item.' });
			});
		} else {
			data.createdDate = new Date();
			data.updatedDate = new Date();

			this._httpService.saveRecord('purchases', data).subscribe((response) => {
				this.loading = false;
				console.log(response);
				if (response.result) {
					this._appService.actionMessage({ title: 'Success!', text: 'Grocery list created successfully.' });
					this._dialogRef.close(true);
				}
			}, (error) => {
				console.log(error);
				this.loading = false;
				this._appService.actionMessage({ title: 'Error!', text: 'Failed to add purchase item.' });
			});
		}
	}


	submitInExpenditure(data) {
		let params: any = {
			date: 	data.date,
			place: 	data.place,
			purpose: data.purpose,
			payment: data.payment,
			description: data.items.toString().replace(/,/g,", "),
			createdDate: new Date()
		};
		console.log(this.data.grocery, data, params);
		this._moneyService.saveExpenditure(params).subscribe((response)=> {
			this.loading = false;
			console.log(response);
			if (response.name) {
				this._appService.actionMessage({ title: 'Success!', text: 'Grocery list updated and saved in expenditure.' });
				this._dialogRef.close(true);
			}
		}, (error) => {
			if (error.status == 401 && error.statusText == "Unauthorized") {
				this.onClose();
			} else {
				this._appService.actionMessage({ title: 'Error!', text: 'Failed to save purchasing in expenditure.' });
			}
			console.log(error);
			this.loading = false;
		});
	}

	get groceryControl() {
		return this.groceryForm.get('items')['controls'];
		// groceryForm.get('items').controls
	}

}
