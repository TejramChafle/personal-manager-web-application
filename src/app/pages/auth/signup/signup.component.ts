import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AppService } from '../../../app.service';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'personal-manager-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  signupForm: NgForm;
  dimentions: { rows: number, cols: number };
  loading: boolean;
  loginComponent: LoginComponent;
  constructor(
    public _authService: AuthService, 
    private _appSerivce: AppService, 
    private _router: Router, 
    private _breakpointObserver: BreakpointObserver) {
    this.dimentions = {
      cols: 3,
      rows: 1
    }
    // check the window size and decide column diamention
    this._breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
          this.dimentions.cols = 3;
          this.dimentions.rows = 1;
        }
      })
    );
    // init login component to reuse social authentication methods
    this.loginComponent = new LoginComponent(this._authService, this._appSerivce, this._router, this._breakpointObserver);
  }

  ngOnInit() {
    // if user is already authenticated, navigate back to home page
    if (this._authService.user) {
      this._router.navigate(['/']);
    }
  }

  onSignup(form: NgForm) {
    console.log({form});
    // Do not trigger form is invalid or password and confirm password doesn't match
    if (form.invalid || form.form.controls.confirmPassword.invalid) {
      return false;
    }
    this.loading = true;
    this._authService.signup({
      username: form.value.username,
      password: form.value.password,
      name: form.value.name
    }).subscribe((response) => {
      this.loading = false;
      // console.log(response);
      if (response) {
        this._appSerivce.actionMessage({ title: 'Success!', text: 'Account created successfully.' });
        this._router.navigate(['']);
      }
    }, (error) => {
      console.log(error);
      this.loading = false;
      /* if (error.error.error.message == 'EMAIL_EXISTS') {
        this._appSerivce.actionMessage({ title: 'Error!', text: 'Email address is already in use. Please login.' });
      } else if (error.error.error.message == 'INVALID_EMAIL') {
        this._appSerivce.actionMessage({ title: 'Error!', text: 'Email address is invalid.' });
      } else {
        this._appSerivce.actionMessage({ title: 'Error!', text: 'Please enter valid inputs.' });
      } */
      this._appSerivce.actionMessage({ title: 'Error!', text: error.error.message });
    })
  }

  onSignin() {
    this._router.navigate(['login']);
  }

  checkError(field, type, inputs) {
    // console.log({field, type, inputs});
    /* switch (type) {
      case 'required':
        return field.control.touched && !field.control.value;
        break;
      case 'equals':
        return field.control.touched && (field.control.value !== inputs.password);
        break;
      default:
        return false;
        break;
    } */
    let isInvalid = false;
    if (type === 'required' && field.control.touched && !field.control.value.length) {
      field.control.status = 'INVALID';
      isInvalid = true;
    } else if (type === 'equals' && field.control.touched && field.control.value.length && (field.control.value !== inputs.password)) {
      field.control.status = 'INVALID';
      isInvalid = true;
    }
    return isInvalid;
  }
}
