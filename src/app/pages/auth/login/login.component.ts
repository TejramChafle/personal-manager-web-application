import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'personal-assistant-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: NgForm;
  dimentions: { rows: number, cols: number };
  loading = false;

  constructor(
    public _authService: AuthService,
    private _router: Router,
    private _snackbar: MatSnackBar,
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
      this._snackbar.open('Username or password is incorrect!', 'Close', {
        duration: 5000,
        horizontalPosition: "center",
        verticalPosition: "bottom"
      })
    })
  }

  onSignup() {
    this._router.navigate(['signup']);
  }

}
