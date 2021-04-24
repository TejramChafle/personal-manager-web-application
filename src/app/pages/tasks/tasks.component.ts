import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskComponent } from './task/task.component';
import { AppService } from '../../app.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'personal-manager-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

export class TasksComponent implements OnInit, OnDestroy {
  tasks: Array<any>;
  loading = false;
  gridCols: number;
  subscription: Subscription;

  constructor(
    private _dialog: MatDialog,
    private _httpService: HttpService,
    private _appService: AppService,
    private _breakpointObserver: BreakpointObserver,
    private _snakBar: MatSnackBar
  ) {
    let breakpoint = { ...Breakpoints };
    _breakpointObserver.observe(
      Object.values(breakpoint)
    ).subscribe(result => {
      for (let device in Breakpoints) {
        if (_breakpointObserver.isMatched(Breakpoints[device]) && (device == 'XSmall')) {
          this.gridCols = 1;
          break;
        } else if (_breakpointObserver.isMatched(Breakpoints[device]) && (device == 'Handset')) {
          this.gridCols = 2;
          break;
        } else if (_breakpointObserver.isMatched(Breakpoints[device]) && (device == 'TabletPortrait')) {
          this.gridCols = 2;
          break;
        } else {
          this.gridCols = 3;
        }
      }
    });

    // On model service subsciorion
    this.subscription = this._appService.dialogRef.subscribe((response) => {
      console.log('dialogRef task.component', response);
    });
  }

  ngOnInit() {
    this._httpService.getRecords('tasks', {}).subscribe((response) => {
      this.loading = false;
      console.log(response);
      this.tasks = response.docs;
    }, (error) => {
      console.log(error);
      this.loading = false;
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to add expenditure item.' });
    });
  }


  openTask(task?: any) {
    let dialogRef = this._dialog.open(TaskComponent, {
      minWidth: '350px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        this.ngOnInit();
      }
    })
  }

  onDelete(task) {
    let dialogRef = this._dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        title: 'Delete?',
        message: 'Are you sure you want to delete this task record?',
        okayText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if (response) {
        let snak = this._snakBar.open('Deleting, Please wait...', 'Close');
        this._httpService.deleteRecord('tasks', task).subscribe((response) => {
          console.log(response);
          this.ngOnInit();
          snak.dismiss();
          this._appService.actionMessage({ title: 'Success!', text: 'Task deleted successfully.' });
        }, (error) => {
          this._appService.actionMessage({ title: 'Error!', text: 'Failed to delete task information' });
          console.log(error);
          snak.dismiss();
        });
      }
    })
  }

  editTask(task, field) {
    task[field] = !task[field];
    let data: any = { ...task };
    data.updatedDate = new Date();
    let snak = this._snakBar.open('Updating, Please wait...', 'Close');
    this._httpService.updateRecord('tasks', data).subscribe((response) => {
      console.log(response);
      if (response.result) {
        this._appService.actionMessage({ title: 'Success!', text: 'Task updated successfully.' });
      }
      snak.dismiss();
    }, (error) => {
      console.log(error);
      snak.dismiss();
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to update task item.' });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
