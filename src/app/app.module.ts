import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { FlexLayoutModule } from '@angular/flex-layout';


// Components
import { NavigationComponent } from './components/navigation/navigation.component';

// Pages
import { LoginComponent } from '../app/pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReturningsComponent } from "./pages/money/returnings/returnings.component";
import { ExpenditureComponent } from './pages/money/expenditures/expenditure/expenditure.component';
import { ReturningComponent } from './pages/money/returnings/returning/returning.component';
import { ExpendituresComponent } from './pages/money/expenditures/expenditures.component';
import { ProfileComponent } from './pages/profile/profile.component';

// Shared Modules
import { AppMaterialModule } from './app.material';
import { AppRoutingModule } from './app.routing';

// Guards
import { AuthGuard } from '../app/guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { UploadPhotoComponent } from './pages/profile/upload-photo/upload-photo.component';

import { ConfirmComponent } from '../app/components/confirm/confirm.component';
import { GroceriesComponent } from './pages/groceries/groceries.component';
import { GroceryComponent } from './pages/groceries/grocery/grocery.component';
import { ManageItemComponent } from './pages/groceries/manage-item/manage-item.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TaskComponent } from './pages/tasks/task/task.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    ReturningsComponent,
    LoginComponent,
    ExpenditureComponent,
    ReturningComponent,
    ExpendituresComponent,
    SignupComponent,
    ProfileComponent,
    UploadPhotoComponent,
    ConfirmComponent,
    GroceriesComponent,
    GroceryComponent,
    ManageItemComponent,
    TasksComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.FIREBASE_CONFIG),
    AngularFireStorageModule,
    // FlexLayoutModule
  ],
  providers: [AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [
    UploadPhotoComponent, 
    ExpenditureComponent, 
    ConfirmComponent, 
    GroceryComponent,
    ManageItemComponent,
    TaskComponent
  ]
})
export class AppModule { }
