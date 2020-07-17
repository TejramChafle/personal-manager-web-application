import { Component } from '@angular/core';
import { AuthService } from '../app/pages/auth/auth.service';

@Component({
  selector: 'personal-manager-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor (public _authService: AuthService) {
    
  }
}
