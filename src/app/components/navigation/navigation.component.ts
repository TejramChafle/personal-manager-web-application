import { Component, AfterContentChecked } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: 'personal-manager-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements AfterContentChecked {
  pageTitle = 'Personal Manager';
  isHandset: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map((result) => { this.isHandset = result.matches; return result.matches; }),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public _authService: AuthService) {
    console.log(history.state);
  }

  ngAfterContentChecked() {
    this.pageTitle = history.state.title || 'Personal Manager';
  }

}
