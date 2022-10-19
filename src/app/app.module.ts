import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http'; 
// import { FlexLayoutModule } from '@angular/flex-layout';

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

// import { TasksModule } from './pages/tasks/tasks.module';
import { AuthModule } from './pages/auth/auth.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProfileComponent,
    UploadPhotoComponent
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
    AngularFireAuthModule,
    ComponentsModule
  ],
  providers: [AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [
    UploadPhotoComponent
  ]
})
export class AppModule { }
