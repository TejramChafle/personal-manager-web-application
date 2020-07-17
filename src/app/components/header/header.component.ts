import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../pages/auth/auth.service';
import { Subscribable } from 'rxjs';

@Component({
  selector: 'personal-assistant-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  subscription: Subscribable<any>;
  constructor(private _authService: AuthService) {
  }

  ngOnInit() {
  }

}
