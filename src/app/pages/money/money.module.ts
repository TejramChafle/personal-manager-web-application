import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AppMaterialModule } from '../../app.material';

import { ReturningsComponent } from "./returnings/returnings.component";
import { ExpenditureComponent } from './expenditures/expenditure/expenditure.component';
import { ReturningComponent } from './returnings/returning/returning.component';
import { ExpendituresComponent } from './expenditures/expenditures.component';

import { AuthGuard } from '../../guards/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
// import { ErrorComponent } from 'src/app/handler/error/error.component';

const routes: Routes = [
  { path: '', children: [
    { path: 'returnings', component: ReturningsComponent },
    { path: 'returnings/returning', component: ReturningComponent },
    { path: 'returnings/returning/:id', component: ReturningComponent },
    { path: 'expenditures', component: ExpendituresComponent },
    { path: 'expenditures/expenditure', component: ExpenditureComponent },
    { path: 'expenditures/expenditure/:id', component: ExpenditureComponent },
  ],
  // canActivateChild: [ AuthGuard ]
}
]

@NgModule({
  declarations: [
    ReturningsComponent,
    ExpenditureComponent,
    ReturningComponent,
    ExpendituresComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule.forChild(routes),
    SharedModule
  ], 
  exports: [
    RouterModule
  ],
  entryComponents: [
    ExpenditureComponent
  ]
})
export class MoneyModule { }
