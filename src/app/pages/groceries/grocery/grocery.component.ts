import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AppService } from '../../../app.service';
import { MoneyService } from '../../money/money.service';
import { HttpService } from 'src/app/http.service';
import { BrowseComponent } from 'src/app/components/browse/browse.component';

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
	autofocused = [];
	itemQuantities: Array<number>;
	constructor(
		private _formBuilder: FormBuilder,
		private _dialogRef: MatDialogRef<GroceryComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _appService: AppService,
		public _moneyService: MoneyService,
		private _httpService: HttpService,
		public _dialog: MatDialog
	) {
		this.groceryForm = this._formBuilder.group({
			date: new FormControl(null, Validators.required),
			purpose: new FormControl( this.data.grocery && this.data.grocery.expenditure && this.data.grocery.expenditure.purpose || 'Grocery' ),
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
				items: this.data.grocery.items.map((item) => { return item.name }),
				place: this.data.grocery.expenditure.place,
				payment: this.data.grocery.payment
			});
			this.itemQuantities = this.data.grocery.items.map((item) => { return item.quantity });
		}
	}

	onAddItem() {
		const control = new FormControl({ value: null, disabled: this.data.isPaid || false }, Validators.required);
		(<FormArray>this.groceryForm.get('items')).push(control);
		// Reset other autofocus and set to newly added
		this.autofocused.forEach((item) => item = false);
		this.autofocused[this.groceryForm.get('items')['value'].length - 1] = true;
		if (!this.itemQuantities) { this.itemQuantities = [] };
		this.itemQuantities[this.groceryForm.get('items')['value'].length - 1] = 1;
	}

	onClose() {
		this._dialogRef.close(false);
	}

	// Decrement the quantity on click of - button in items list
	removeItem(item) {
		const itemIndex = this.groceryForm.get('items')['controls'].indexOf(item);
		if (this.itemQuantities[itemIndex] <= 0) {
			// If the value is less than 0, then delete item from list
			this.removeItemFromForm(itemIndex);
		} else {
			this.itemQuantities[itemIndex] -= 1;
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
			data.items.forEach((item, key) => {
				item = item.trim();
				items.push({name: item, quantity: this.itemQuantities[key]});
			});
		}
		data.items = items;
		console.log('this.id', this.id);
		if (this.id) {
			data.id = this.id;
			data.updatedDate = new Date();
			data.createdDate = this.data.grocery.createdDate;
			data.expenditure = this.data.grocery.expenditure;
			data.expenditure.purpose = data.purpose;
			data.expenditure.place = data.place;
			console.log('data:', data );

			this._httpService.updateRecord('purchases', data).subscribe((response) => {
				this.loading = false;
				console.log(response);
				if (response.ok) {
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
			console.log('data:', data );
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


	// Find the list of items for suggestions. The suggestions will come from previously purchanges 100 items in same purpose of shopping 
	onBrowse() {
		let dialogRef = this._dialog.open(BrowseComponent, {
			minWidth: '350px',
			data: { page: 'purchases', purpose: this.groceryForm.get('purpose')['value'], type: 'items', records: this.groceryForm.get('items')['value'] }
		});

		dialogRef.afterClosed().subscribe((resp) => {
			console.log(resp);
			if (resp) {
				let items = [];
				// Add new items in the item list
				resp.forEach(element => {
					// Add new item in the list only if not present previously
					if (!this.groceryForm.get('items')['value'].includes(element.name)) {
						this.onAddItem();
						items.push(element.name);
					}
				});
				// Add the browsed items in existing form
				this.groceryForm.patchValue({
					items: this.groceryForm.get('items')['value'].concat(items).filter((item) => item !== null)
				});
			}
		})
	}

	// Remove item from items array form controls 
	removeItemFromForm(itemIndex) {
		this.groceryForm.get('items')['controls'].splice(itemIndex, 1);
		this.groceryForm.get('items')['value'].splice(itemIndex, 1);
		// RESET items if all removed
		if (this.groceryForm.get('items')['controls'].length == 0) {
			this.groceryForm.get('items').reset();
		}
		this.itemQuantities.splice(itemIndex, 1);
	}

	// Add 1 on click of + button of item list 
	addItem(item) {
		const itemIndex = this.groceryForm.get('items')['controls'].indexOf(item);
		this.itemQuantities[itemIndex] += 1;
	}

	// On manually changing quantity in items list, adjust the quantities in form controls 
	onQuantityChange(event, index) {
		this.itemQuantities[index] = parseInt(event.target.value, 10);
		if (this.itemQuantities[index] <= 0) {
			this.removeItemFromForm(index);
		}
	}

}
