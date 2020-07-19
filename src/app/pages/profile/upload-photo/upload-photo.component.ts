import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../../../app.service';

@Component({
  selector: 'personal-manager-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss']
})

export class UploadPhotoComponent implements OnInit {
  public user
  public photoURL: string;

  selectedFile: File = null;
  downloadURL: Observable<string>;
  uploadProgress: Observable<number>;

  isUploading = false;
  isUploaded = false;
  hasError = false;

  constructor(
    private _fireStorage: AngularFireStorage, 
    private _authService: AuthService,
    private _dialogRef: MatDialogRef<UploadPhotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _appService: AppService
    ) { }

  ngOnInit() {
    console.log(this.data);
    this.photoURL = this.data.photoURL;
    this.user = this.data.user;
  }


  onPhotoSelect(event) {
    console.log(event.target.files);
    this.selectedFile = event.target.files[0];
  }

  onUploadPhoto() {

    // Check if the file is selected
    if (!this.selectedFile) {
      this._appService.actionMessage({title: 'Error!', text: 'Please browse file to upload!'});
      return false;
    }
    
    this.isUploading = true;
    const filePath = 'profile-pictures/' + this.user.displayName.replace(' ', '-').toLowerCase();
    const fileRef = this._fireStorage.ref(filePath);

    const task = this._fireStorage.upload(filePath, this.selectedFile);
    task.snapshotChanges().pipe(
      finalize(()=> {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe((url)=>{
          console.log(url);
          if(url) {
            this.photoURL = url;
            this.updateUserInfo();
          }
        }, (error)=> {
          console.log(error);
          this.hasError = true;
        })
      })
    ).subscribe((response)=> {
      console.log(response);
    });

    this.uploadProgress = task.percentageChanges();
  }

  updateUserInfo() {
    this._authService.updateUser({photoUrl: this.photoURL}).subscribe((response)=> {
      console.log(response);
      this.isUploaded = true;
      this.isUploading = false;
    }, (error)=> {
      console.log(error);
      this.isUploading = false;
      this.hasError = true;
    })
  }

  onClose() {
    if (this.isUploaded) {
      this._dialogRef.close(this.photoURL);
    } else {
      this._dialogRef.close(false);
    }
  }

}
