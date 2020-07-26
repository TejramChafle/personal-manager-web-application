import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TimesheetService } from '../timesheet.service';
import { AppService } from '../../../app.service';
import { BrowseComponent } from '../browse/browse.component';

@Component({
  selector: 'personal-manager-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})

export class TimesheetComponent implements OnInit {

  timesheetForm: FormGroup
  loading = false;
  id
  today: string;

  constructor(
    private _dialogRef: MatDialogRef<TimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public _timesheetService: TimesheetService,
    public _appService: AppService,
    public _dialog: MatDialog
  ) {
  
    // SET min date for start date selection to today
    this.today = this._appService.inputDate(new Date());

    this.timesheetForm = this._formBuilder.group({
      date: new FormControl(this.today, Validators.required),
      description: new FormControl(null, Validators.required),
      tasks: new FormArray([], Validators.required)
    });

    console.log('this.data : ', this.data.timesheet);

    if (this.data.timesheet) {
      // SET id for update
      this.id = this.data.timesheet.id;
      // Initialize form
      this.timesheetForm.patchValue({
        date: this.data.timesheet.date,
        description: this.data.timesheet.description,
        tasks: this.data.timesheet.tasks || []
      });
    }
  }

  ngOnInit() {
  }

  onClose() {
    this._dialogRef.close(false);
  }

  onSubmit(form: FormGroup) {
    this.loading = true;
    console.log(form);
    let data: any = {
      date: form.value.date,
      description: form.value.description,
      tasks: form.value.tasks
    };
    console.log(data);

    if (this.id) {
      data.id = this.id;
      data.updatedDate = new Date();
      data.createdDate = this.data.timesheet.createdDate;
      this._timesheetService.updateTimesheet(data).subscribe((response) => {
        console.log(response);
        this.loading = false;
        this._appService.actionMessage({ title: 'Success!', text: 'Timesheet record updated successfully.' });
        this._dialogRef.close(true);
      }, (error) => {
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.onClose();
        } else {
          this._appService.actionMessage({ title: 'Error!', text: 'Failed to update timesheet record.' });
        }
        console.log(error);
        this.loading = false;
      });
    } else {
      data.createdDate = new Date();
      this._timesheetService.saveTimesheet(data).subscribe((response) => {
        this.loading = false;
        console.log(response);
        if (response.name) {
          this._appService.actionMessage({ title: 'Success!', text: 'Timesheet list created successfully.' });
          this._dialogRef.close(true);
        }
      }, (error) => {
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.onClose();
        } else {
          this._appService.actionMessage({ title: 'Error!', text: 'Failed to create timesheet list.' });
        }
        console.log(error);
        this.loading = false;
      });
    }
  }

  get timesheetControl() {
    return this.timesheetForm.get('tasks')['controls'];
  }

  onAddTask() {
		// const control = new FormControl(null, Validators.required);
    // (<FormArray>this.timesheetForm.get('tasks')).push(control);

    let dialogRef = this._dialog.open(BrowseComponent, {
      minWidth: '350px'
    });

    dialogRef.afterClosed().subscribe((resp)=> {
      console.log(resp);
      // Populate the items
			do {
        // this.onAddTask()
        const control = new FormControl(null, Validators.required);
        (<FormArray>this.timesheetForm.get('tasks')).push(control);
			} while (this.timesheetForm.get('tasks')['controls'].length < resp.length);

			// Add the payment form control since user has opted to add payment detail
			this.timesheetForm.patchValue({
				tasks: resp
			});
    })

	}

	removeTask(index) {
		this.timesheetForm.get('tasks')['controls'].splice(index, 1);
		this.timesheetForm.get('tasks')['value'].splice(index, 1);
		// RESET tasks if all removed
		if (this.timesheetForm.get('tasks')['controls'].length == 0) {
			this.timesheetForm.get('tasks').reset();
		}
	}

}
