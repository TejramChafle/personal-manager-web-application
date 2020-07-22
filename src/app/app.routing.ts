
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from '../app/pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { DashboardComponent } from "../app/pages/dashboard/dashboard.component";
import { ReturningsComponent } from "./pages/money/returnings/returnings.component";
import { ReturningComponent } from './pages/money/returnings/returning/returning.component';
import { ExpendituresComponent } from './pages/money/expenditures/expenditures.component';
import { ExpenditureComponent } from './pages/money/expenditures/expenditure/expenditure.component';
import { GroceriesComponent } from './pages/groceries/groceries.component';

import { AuthGuard } from '../app/guards/auth.guard';

const routes: Routes = [
    // { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
    // { path: '', redirectTo : '/home', pathMatch : 'full' },
    { path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'returnings', component: ReturningsComponent, canActivate: [AuthGuard] },
    { path: 'returnings/returning', component: ReturningComponent, canActivate: [AuthGuard] },
    { path: 'returnings/returning/:id', component: ReturningComponent, canActivate: [AuthGuard] },
    { path: 'expenditures', component: ExpendituresComponent, canActivate: [AuthGuard] },
    { path: 'expenditures/expenditure', component: ExpenditureComponent, canActivate: [AuthGuard] },
    { path: 'expenditures/expenditure/:id', component: ExpenditureComponent, canActivate: [AuthGuard] },
    { path: 'groceries', component: GroceriesComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}