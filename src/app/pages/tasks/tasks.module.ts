import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AppMaterialModule } from '../../app.material';

import { TasksComponent } from './tasks.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  { path: '', component: TasksComponent }
]

@NgModule({
  declarations: [
    TasksComponent,
    TaskComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppMaterialModule
  ], 
  exports: [ RouterModule ],
  entryComponents: [
    TaskComponent
  ]
})
export class TasksModule { }
