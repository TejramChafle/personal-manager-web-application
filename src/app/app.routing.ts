
import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";

import { LoginComponent } from '../app/pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DashboardComponent } from "../app/pages/dashboard/dashboard.component";

import { AuthGuard } from '../app/guards/auth.guard';

const routes: Routes = [
    { path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'groceries', loadChildren: () => import('./pages/groceries/grocery.module').then(module => module.GroceryModuleClass), canActivate: [AuthGuard] },
    { path: 'timesheets', loadChildren: () => import('./pages/timesheets/timesheets.module').then(module => module.TimesheetsModule), canActivate: [AuthGuard] },
    { path: 'tasks', loadChildren: () => import('./pages/tasks/tasks.module').then(module => module.TasksModule), canActivate: [AuthGuard] },
    { path: 'money', loadChildren: () => import('./pages/money/money.module').then(module => module.MoneyModule), canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})

export class AppRoutingModule { }