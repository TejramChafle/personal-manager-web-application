import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskComponent } from './task/task.component';
import { AppService } from '../../app.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { TaskService } from './task.service';

@Component({
  selector: 'personal-manager-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

export class TasksComponent implements OnInit {
  tasks: Array<any>;
  loading = false;
  gridCols: number;

  constructor(
    private _dialog: MatDialog,
    private _taskService: TaskService,
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
  }

  ngOnInit() {
    this._taskService.getTasks().subscribe((response) => {
      console.log(response);
      this.tasks = response;
    }, (error) => {
      if (error.status == 401 && error.statusText == "Unauthorized") {
      } else {
        this._appService.actionMessage({ title: 'Error!', text: 'Failed to get tasks information' });
      }
      console.log(error);
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
        this._taskService.deleteTask(task).subscribe((response) => {
          console.log(response);
          snak.dismiss();

          // Refresh the list once deleted
          if (response == null) {
            this.ngOnInit();
          }
        }, (error) => {
          if (error.status == 401 && error.statusText == "Unauthorized") {
          } else {
            this._appService.actionMessage({ title: 'Error!', text: 'Failed to delete task information' });
          }
          console.log(error);
          snak.dismiss();
        })
      }
    })
  }
}
