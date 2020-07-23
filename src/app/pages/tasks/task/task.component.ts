import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { AppService } from '../../../app.service';

@Component({
  selector: 'personal-manager-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
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
    public _taskService: TaskService,
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

    if (!this.data.task) {
      this.labels = [];
      this._taskService.labels.forEach((label) => {
        this.labels.push({ isChecked: false, name: label.name, color: label.color });
      });
    }

    // SET min date for start date selection to today
    this.today = this._appService.inputDate(new Date());
  }

  ngOnInit() {
    console.log(this._taskService.labels);
  }

  onClose() {
    this._dialogRef.close(false);
  }

  // Toggle the label status
  onClickLabel(label) {
    this.labels[this.labels.indexOf(label)].isChecked = !this.labels[this.labels.indexOf(label)].isChecked;
  }

  onSubmit(form: FormGroup) {
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
      this._taskService.updateTask(data).subscribe((response) => {
        console.log(response);
        this.loading = false;
        this._appService.actionMessage({ title: 'Success!', text: 'Task record updated successfully.' });
        this._dialogRef.close(true);
      }, (error) => {
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.onClose();
        } else {
          this._appService.actionMessage({ title: 'Error!', text: 'Failed to update task record.' });
        }
        console.log(error);
        this.loading = false;
      });
    } else {
      data.createdDate = new Date();
      this._taskService.saveTask(data).subscribe((response) => {
        this.loading = false;
        console.log(response);
        if (response.name) {
          this._appService.actionMessage({ title: 'Success!', text: 'Task list created successfully.' });
          this._dialogRef.close(true);
        }
      }, (error) => {
        if (error.status == 401 && error.statusText == "Unauthorized") {
          this.onClose();
        } else {
          this._appService.actionMessage({ title: 'Error!', text: 'Failed to create task list.' });
        }
        console.log(error);
        this.loading = false;
      });
    }
  }

}
