import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { HttpService } from 'src/app/http.service';

@Component({
	selector: 'personal-manager-expenditure',
	templateUrl: './expenditure.component.html',
	styleUrls: ['./expenditure.component.scss']
})

export class ExpenditureComponent implements OnInit {
	expenditureForm: FormGroup;
	loading = false;
	id
	today: string;

	constructor(
		public _httpService: HttpService,
		private _formBuilder: FormBuilder,
		private _dialogRef: MatDialogRef<ExpenditureComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public _appService: AppService
	) {
		this.expenditureForm = this._formBuilder.group({
			date: new FormControl(null, Validators.required),
			purpose: new FormControl(null, Validators.required),
			place: new FormControl(null, Validators.required),
			description: new FormControl(),
			payment: new FormGroup({
				amount: new FormControl(null, Validators.required),
				status: new FormControl('Paid', Validators.required),
				method: new FormControl(null, Validators.required),
				// bill: new FormControl(null)
			})
		});

		// SET the max date in date input to restrict user from adding future dates
		this.today = this._appService.inputDate(new Date());
	}

	ngOnInit() {
		console.log(this.data);
		if (this.data.expenditure) {
			this.id = this.data.expenditure._id;
			delete this.data.expenditure.id;
			delete this.data.expenditure.createdDate;
			delete this.data.expenditure.user;
			// this.expenditureForm.setValue(this.data.expenditure);
			this.expenditureForm.patchValue({
				date: this._appService.inputDate(new Date(this.data.expenditure.date)),
				purpose: this.data.expenditure.purpose,
				description: this.data.expenditure.description,
				place: this.data.expenditure.place,
				payment: this.data.expenditure.payment
			});
		}
	}


	onClose() {
		this._dialogRef.close(false);
	}

	onSubmit(form: FormGroup) {
		console.log(form);
		let data: any = { ...form.value };
		console.log(data);

		if (this.data.expenditure) {
			this.loading = true;
			data.updatedDate = new Date();
			data.id = this.id;
			data.payment._id = this.data.expenditure.payment._id;
			console.log('updating..', data);
			this._httpService.updateRecord('expenditures', data).subscribe((response) => {
				this.loading = false;
				console.log(response);
				if (response.ok) {
					this._appService.actionMessage({ title: 'Success!', text: 'Expenditures added successfully.' });
					this._dialogRef.close(true);
				}
			}, (error) => {
				console.log(error);
				this.loading = false;
				this._appService.actionMessage({ title: 'Error!', text: 'Failed to add expenditure item.' });
			});
		} else {
			this.loading = true;
			data.createdDate = new Date();
			/* this._moneyService.saveExpenditure(data).subscribe((response) => {
				console.log(response);
				// If the result contain id with field name then close dialog
				if (response.name) {
					this._appService.actionMessage({ title: 'Success!', text: 'Expenditure information saved successfully' });
					this._dialogRef.close(true);
				}
				this.loading = false;
			}, (error) => {
				if (error.status == 401 && error.statusText == "Unauthorized") {
					this.onClose();
				} else {
					this._appService.actionMessage({ title: 'Error!', text: 'Failed to save expenditure information' });
				}
				console.log(error);
				this.loading = false;
			}) */
			this._httpService.saveRecord('expenditures', data).subscribe((response) => {
				this.loading = false;
				console.log(response);
				if (response.result) {
					this._appService.actionMessage({ title: 'Success!', text: 'Expenditure added successfully.' });
					this._dialogRef.close(true);
				}
			}, (error) => {
				console.log(error);
				this.loading = false;
				this._appService.actionMessage({ title: 'Error!', text: 'Failed to add expenditure item.' });
			});
		}
	}

}
