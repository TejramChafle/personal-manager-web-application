import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { AppService } from '../../../app.service';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'personal-manager-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TaskComponent implements OnInit {
  taskForm: FormGroup
  loading = false;
  id
  // Task field
  isStarred = false;
  isImportant = false;
  isDone = false;
  labels: Array<{ isChecked: boolean, name: string, color: string }>;

  today: string;

  constructor(
    private _dialogRef: MatDialogRef<TaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public _httpService: HttpService,
    public _appService: AppService
  ) {
    this.taskForm = this._formBuilder.group({
      title: new FormControl(null, Validators.required),
      notes: new FormControl(null, Validators.required),
      schedule: new FormGroup({
        startDate: new FormControl(null),
        dueDate: new FormControl(null),
        startTime: new FormControl(null),
        endTime: new FormControl(null),
      })
    });

    console.log('this.data : ', this.data.task);

    if (this.data.task) {
      // SET id for update
      this.id = this.data.task._id;
      // Initialize labels dropdown by comparing existing selected labels
      this.labels = [];
      this._appService.labels.forEach((label) => {
        if (this.data.task.labels) {
          this.labels.push({ isChecked: this.data.task.labels.find((lab) => { return lab.name == label.name; }) ? true : false, name: label.name, color: label.color });
        } else {
          this.labels.push({ isChecked: false, name: label.name, color: label.color });
        }
      });
      // Initialize form
      this.taskForm.patchValue({
        title: this.data.task.title,
        notes: this.data.task.notes,
        schedule: this.data.task.schedule || {}
      });
      // SET task header actions
      this.isStarred = this.data.task.isStarred;
      this.isImportant = this.data.task.isImportant;
      this.isDone = this.data.task.isDone;
    } else {
      this.labels = [];
      this._appService.labels.forEach((label) => {
        this.labels.push({ isChecked: false, name: label.name, color: label.color });
      });
    }

    // SET min date for start date selection to today
    this.today = this._appService.inputDate(new Date());
  }

  ngOnInit() {
    console.log(this._appService.labels);
  }

  onClose() {
    this._dialogRef.close(false);
  }

  // Toggle the label status
  onClickLabel(label) {
    this.labels[this.labels.indexOf(label)].isChecked = !this.labels[this.labels.indexOf(label)].isChecked;
  }

  onSubmit(form: FormGroup) {
    this.loading = true;
    console.log(form);
    let data: any = {
      title: form.value.title,
      notes: form.value.notes,
      schedule: form.value.schedule,
      labels: this.labels.filter((label) => { return label.isChecked }),
      isStarred: this.isStarred,
      isImportant: this.isImportant,
      isDone: this.isDone
    };
    console.log(data);

    if (this.id) {
      data.id = this.id;
      data.updatedDate = new Date();
      data.createdDate = this.data.task.createdDate;
      this._httpService.updateRecord('tasks', data).subscribe((response) => {
        console.log(response);
        this.loading = false;
        this._appService.actionMessage({ title: 'Success!', text: 'Task record updated successfully.' });
        this._dialogRef.close(true);
      }, (error) => {
        this._appService.actionMessage({ title: 'Error!', text: 'Failed to update task record.' });
        console.log(error);
        this.loading = false;
      });
    } else {
      data.createdDate = new Date();
      this._httpService.saveRecord('tasks', data).subscribe((response) => {
        this.loading = false;
        console.log(response);
        if (response.result) {
          this._appService.actionMessage({ title: 'Success!', text: 'Task list created successfully.' });
          this._dialogRef.close(true);
        }
      }, (error) => {
        this._appService.actionMessage({ title: 'Error!', text: 'Failed to create task list.' });
        console.log(error);
        this.loading = false;
      });
    }
  }

}
