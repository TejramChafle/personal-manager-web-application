import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http'; 
// import { FlexLayoutModule } from '@angular/flex-layout';

// Components
import { NavigationComponent } from './components/navigation/navigation.component';

// Pages
// import { LoginComponent } from '../app/pages/auth/login/login.component';
// import { SignupComponent } from './pages/auth/signup/signup.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
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

// import { TasksModule } from './pages/tasks/tasks.module';
import { AuthModule } from './pages/auth/auth.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { SearchComponent } from './components/search/search.component';
import { SortComponent } from './components/sort/sort.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    // LoginComponent,
    // SignupComponent,
    ProfileComponent,
    UploadPhotoComponent,
    ConfirmComponent,
    SearchComponent,
    SortComponent
  ],
  imports: [
    BrowserModule,

    BrowserAnimationsModule,

    AppMaterialModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.FIREBASE_CONFIG),
    AngularFireStorageModule,
    // FlexLayoutModule,
    // TasksModule,
    AuthModule,
    AngularFireAuthModule
  ],
  providers: [AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [
    UploadPhotoComponent,
    ConfirmComponent,
    SearchComponent,
    SortComponent
  ]
})
export class AppModule { }
