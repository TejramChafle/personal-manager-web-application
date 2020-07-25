import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TimesheetsComponent } from './timesheets.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { BrowseComponent } from './browse/browse.component';

import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  { path: '', component: TimesheetsComponent, canActivate: [AuthGuard] }
]

@NgModule({
  declarations: [
    TimesheetsComponent,
    TimesheetComponent,
    BrowseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class TimesheetsModule { }
