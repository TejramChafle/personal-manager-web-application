import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../../../app.service';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'personal-manager-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BrowseTaskComponent implements OnInit {
  tasks: Array<any>;
  search: string;
  loading = false;

  constructor(
    private _dialogRef: MatDialogRef<BrowseTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _httpService: HttpService,
    private _appService: AppService
  ) { }

  ngOnInit() {
    /* this._taskService.getTasks().subscribe((response) => {
      console.log(response);
      this.tasks = [];
      response.forEach(task => {
        task.time = task.schedule ? this._appService.timeDifference(task.schedule) : task.schedule;
        if (this.data.tasks && this.data.tasks.length) {
          let item = this.data.tasks.find((t) => { return t.id == task.id });
          if (item) {
            task.isChecked = true;
          }
        }
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
    }); */

    this._httpService.getRecords('tasks', {}).subscribe((response) => {
      this.loading = false;
      console.log(response);
      this.tasks = response.docs;
    }, (error) => {
      console.log(error);
      this.loading = false;
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to get tasks.' });
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
