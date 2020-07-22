import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroceryService } from '../grocery.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AppService } from '../../../app.service';
import { MoneyService } from '../../money/money.service';

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
		private _groceryService: GroceryService,
		private _formBuilder: FormBuilder,
		private _dialogRef: MatDialogRef<GroceryComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _appService: AppService,
		public _moneyService: MoneyService
	) {
		this.groceryForm = this._formBuilder.group({
			date: new FormControl(null),
			purpose: new FormControl('Grocery'),
			place: new FormControl(null, Validators.required),
			items: new FormArray([], Validators.required),
			/* payment: new FormGroup({
				amount: new FormControl(null, Validators.required),
				status: new FormControl('Paid', Validators.required),
				method: new FormControl(null, Validators.required),
				// bill: new FormControl(null)
			}) */
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
			this.id = this.data.grocery.id;
			// Populate the items
			do {
				this.onAddItem()
			} while (this.groceryForm.get('items')['controls'].length < this.data.grocery.items.length);

			// Add the payment form control since user has opted to add payment detail
			this.groceryForm.patchValue({
				date: this.data.grocery.date,
				purspose: this.data.grocery.purpose,
				items: this.data.grocery.items,
				place: this.data.grocery.place,
				payment: this.data.grocery.payment
			});
		}
	}

	onAddItem() {
		const control = new FormControl(null, Validators.required);
		(<FormArray>this.groceryForm.get('items')).push(control);
	}

	onClose() {
		this._dialogRef.close(false);
	}

	removeItem(item) {
		this.groceryForm.get('items')['controls'].splice(this.groceryForm.get('items')['controls'].indexOf(item), 1);
		// RESET items if all removed
		if (this.groceryForm.get('items')['controls'].length == 0) {
			this.groceryForm.get('items').reset();
		}
	}

	onSubmit(form: FormGroup) {
		this.loading = true;
		console.log(form);
		let data: any = { ...form.value };

		if (this.id) {
			data.id = this.id;
			data.updatedDate = new Date();
			data.createdDate = this.data.grocery.createdDate;
			this._groceryService.updateGrocery(data).subscribe((response) => {
				this.loading = false;
				console.log(response);
				this._appService.actionMessage({ title: 'Success!', text: 'Grocery record updated successfully.' });
				this._dialogRef.close(true);
			}, (error) => {
				if (error.status == 401 && error.statusText == "Unauthorized") {
					this.onClose();
				} else {
					this._appService.actionMessage({ title: 'Error!', text: 'Failed to update grocery record.' });
				}
				console.log(error);
				this.loading = false;
			});
		} else {
			data.createdDate = new Date();
			this._groceryService.saveGrocery(data).subscribe((response) => {
				this.loading = false;
				console.log(response);
				if (response.name) {
					this._appService.actionMessage({ title: 'Success!', text: 'Grocery list created successfully.' });
					this._dialogRef.close(true);
				}
			}, (error) => {
				if (error.status == 401 && error.statusText == "Unauthorized") {
					this.onClose();
				} else {
					this._appService.actionMessage({ title: 'Error!', text: 'Failed to create grocery list.' });
				}
				console.log(error);
				this.loading = false;
			});
		}
	}

}
