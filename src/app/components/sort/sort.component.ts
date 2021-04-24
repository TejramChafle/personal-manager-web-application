import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'personal-manager-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})

export class SortComponent implements OnInit {
  enabledFields: any = {};
  sortby = [];
  constructor(
    private _appService: AppService,
    private _bottomSheetRef: MatBottomSheetRef<SortComponent>) {
    // Find the path and page name
    const path = window.location.pathname.split('/');
    const page = path[path.length - 1];

    // Filter out the enabled fields for input
    this._appService.sortOptions.forEach((option) => {
      if (option.visibleOn.indexOf(page) > -1) {
        this.sortby.push(option);
      }
    });
  }

  ngOnInit() {
  }

  openLink(event: MouseEvent, option): void {
    console.log('openLink event', event, option);
    this._bottomSheetRef.dismiss(option);
    event.preventDefault();
  }
}
