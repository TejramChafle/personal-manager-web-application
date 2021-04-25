import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppMaterialModule } from '../../app.material';

import { TimesheetsComponent } from './timesheets.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { BrowseTaskComponent } from './browse/browse.component';

import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  { path: '', component: TimesheetsComponent, canActivate: [AuthGuard] }
]

@NgModule({
  declarations: [
    TimesheetsComponent,
    TimesheetComponent,
    BrowseTaskComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppMaterialModule
  ],
  exports: [
    RouterModule
  ],
  entryComponents: [
    TimesheetComponent,
    BrowseTaskComponent
  ]
})

export class TimesheetsModule { }
