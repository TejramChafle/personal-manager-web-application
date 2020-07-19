import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../pages/auth/auth.service';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'personal-manager-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  @ViewChild('profileForm', {static: true}) profileForm: NgForm;
  user
  constructor(
    private _authService: AuthService, 
    private _appService: AppService, 
    private _router: Router,
    public _dialog: MatDialog) {
  }

  ngOnInit() {
    console.log(this.user);
    this._authService.getUser().subscribe((response) => {
      this.user = response.users[0];
      this.profileForm.control.setValue({
        name: this.user.displayName || '',
        username: this.user.email,
        password: this.user.providerUserInfo[0].providerId
      });
      console.log(this.user);
    }, (error) => {
      console.log(error.error.error);
      if (error.error.error.message == 'INVALID_ID_TOKEN') {
        this._authService.logout();
        this._router.navigate(['/login']);
      } else {
        this._appService.actionMessage({ title: 'Error!', text: 'Unable to get profile information.' });
      }
    })
  }

  onUpdateProfile(form) {
    this._authService.updateUser(form).subscribe((response)=> {
      // console.log(response);
      this._appService.actionMessage({ title: 'Success!', text: 'Profile information updated successfully.' });
    }, (error) => {
      console.log(error);
      this._appService.actionMessage({ title: 'Error!', text: 'Unable to update profile information.' });
    })
  }


  onUpdatePhoto() {
    let dialogRef = this._dialog.open(UploadPhotoComponent, {
      minWidth: '350px',
      data: { photoURL: this.user.photoUrl || 'http://www.cse.mrt.ac.lk/images/people/profile.jpg', user: this.user }
    });

    dialogRef.afterClosed().subscribe((result)=> {
      if (result) {
        this.user.photoUrl = result;
      }
    })
  }

}
