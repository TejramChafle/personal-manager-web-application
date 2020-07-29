import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../tasks/task.service';
import { AppService } from '../../../app.service';

@Component({
  selector: 'personal-manager-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BrowseComponent implements OnInit {
  tasks: Array<any>;
  search: string;
  loading = false;

  constructor(
    private _dialogRef: MatDialogRef<BrowseComponent>,
    private _taskService: TaskService,
    private _appService: AppService
  ) { }

  ngOnInit() {
    this._taskService.getTasks().subscribe((response) => {
      console.log(response);
      this.tasks = [];
      response.forEach(task => {
        task.time = task.schedule ? this._appService.timeDifference(task.schedule) : task.schedule;
        console.log(task);
        this.tasks.push(task);
      });
      // this.tasks = response;
    }, (error) => {
      if (error.status == 401 && error.statusText == "Unauthorized") {
        this.onClose();
      } else {
        this._appService.actionMessage({ title: 'Error!', text: 'Failed to get tasks information' });
      }
      console.log(error);
    });
  }

  onClose() {
    this._dialogRef.close(false);
  }

  onSubmit() {
    console.log(this.tasks.filter(task=>task.isChecked));
    this._dialogRef.close(this.tasks.filter(task=>task.isChecked));
  }

  get isChecked() {
    return this.tasks && this.tasks.filter(task=>task.isChecked).length || false;
  }

}
