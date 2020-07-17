import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AppService } from '../../../app.service';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'personal-manager-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  signupForm: NgForm;
  dimentions: { rows: number, cols: number };

  constructor(
    private _authService: AuthService, 
    private _appSerivce: AppService, 
    private _router: Router, 
    private _breakpointObserver: BreakpointObserver) { 
    this.dimentions = {
      cols: 3,
      rows: 1
    }

    this._breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
          this.dimentions.cols = 3;
          this.dimentions.rows = 1;
        }
      })
    );

    if (this._authService.user) {
      this._router.navigate(['/']);
    }
  }

  ngOnInit() {
  }

  onSignup(form: NgForm) {
    this._authService.signup(form).subscribe((response) => {
      console.log(response);
      if (response) {
        this._appSerivce.actionMessage({ title: 'Success!', text: 'Account created successfully.' });
        this._router.navigate(['']);
      }
    }, (error) => {
      console.log(error);
      if (error.error.error.message == 'EMAIL_EXISTS') {
        this._appSerivce.actionMessage({ title: 'Error!', text: 'Email address is already in use. Please login.' });
      } else if (error.error.error.message == 'INVALID_EMAIL') {
        this._appSerivce.actionMessage({ title: 'Error!', text: 'Email address is invalid.' });
      } else {
        this._appSerivce.actionMessage({ title: 'Error!', text: 'Please enter valid inputs.' });
      }
      
    })
  }

}
