import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app.material';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path:'login', component: LoginComponent },
  { path:'signup', component: SignupComponent }
]

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule
  ]
})

export class AuthModule { }
