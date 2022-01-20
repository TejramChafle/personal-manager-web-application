import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'personal-assistant-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {
  loginForm: NgForm;
  dimentions: { rows: number, cols: number };
  loading = false;

  constructor(
    public _authService: AuthService,
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
    // console.log(window.history.state);
  }

  onLogin(form: NgForm) {
    this.loading = true;
    this._authService.login(form).subscribe((response) => {
      this.loading = false;
      this._router.navigate([window.history.state.url || '/']);
    }, (error) => {
      this.loading = false;
      this._appSerivce.actionMessage({ title: 'Error!', text: 'Username or password is incorrect!' });
    })
  }

  onSignup() {
    this._router.navigate(['signup']);
  }

  doSocialAuthenticationWith(channel) {
    this.loading = true;
    this._authService.doSocialAuthenticationWith(channel).then((response) => {
      // console.log({ response });
      this.onSocialAuthentication(response);
    }).catch((error) => {
      // console.log({error});
      this.loading = false;
      this._appSerivce.actionMessage({ title: 'Error!', text: 'Failed to login with ' + channel });
    })
  }

  onSocialAuthentication(response) {
    this._authService.validateSocialSignInAndAuthenticate(response).subscribe((resp) => {
      this.loading = false;
      this._router.navigate([window.history.state.url || '/']);
    }, (error) => {
      this.loading = false;
      this._appSerivce.actionMessage({ title: 'Error!', text: error.error.error || error.error.message });
    });
  }
}
