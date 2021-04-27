import { ViewChild } from '@angular/core';
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'personal-manager-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BrowseComponent implements OnInit {
  records: Array<any>;
  search: string;
  loading = false;
  @ViewChild('chosenRecords', {static: true }) chosenRecords; 
  constructor(
    private _dialogRef: MatDialogRef<BrowseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _httpService: HttpService,
    private _appService: AppService
  ) { }

  ngOnInit() {
    console.log('data', this.data);
    const params = { type: this.data.type, purpose: this.data.purpose, order: 'desc', page: 1, limit: 100 };
    this._httpService.getRecords(this.data.page + '/browse', params).subscribe((response) => {
      this.loading = false;
      console.log(response);
      this.records = response.docs.map((doc) => {
        return {
          name: doc,
          isChecked: false
        }
      });
      // console.log('this.records', this.records);
      this.checkAlreadySelected();
    }, (error) => {
      console.log(error);
      this.loading = false;
      this._appService.actionMessage({ title: 'Error!', text: 'Failed to get records.' });
    });
  }

  onClose() {
    this._dialogRef.close(false);
  }

  onSubmit() {
    this._dialogRef.close(this.records.filter(record => record.isChecked));
  }

  get isChecked() {
    return this.records && this.records.filter(record => record.isChecked).length || false;
  }

  onChangeItem() {
    this.chosenRecords.selectedOptions.selected.forEach(selectedItem => {
      let item = this.records.find((record) => { return record.name == selectedItem.value.name });
      if (item) { item.isChecked = true; }
    });
  }

  checkAlreadySelected() {
    if (this.data.records && this.data.records.length) {
      this.records.forEach((record) => {
        record.isChecked = this.data.records.includes(record.name);
      })
    }
  }

  onChangeSearch() {
    console.log('onChangeSearch', this.search);
    this.records = this.records.filter((record)=>{
      return record.name.toLowerCase().includes(this.search.toLowerCase());
    })
  }

}
