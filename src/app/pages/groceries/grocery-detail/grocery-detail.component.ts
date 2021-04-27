import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../../../app.service';
import { HttpService } from 'src/app/http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'personal-manager-grocery-detail',
	templateUrl: './grocery-detail.component.html',
	styleUrls: ['./grocery-detail.component.scss']

})

export class GroceryDetailComponent implements OnInit, OnDestroy {
	loading = false;
	id
    purchase: any;
	constructor(
		private _appService: AppService,
		private _httpService: HttpService,
        private _activatedRoute: ActivatedRoute
	) {
        this._activatedRoute.paramMap.subscribe((response)=> {
			this.id = response['params'].id;
        })
	}
    ngOnDestroy(): void {
        localStorage.removeItem('purchase');
    }

	ngOnInit() {
		// console.log(this.data);
        const purchase = localStorage.getItem('purchase');
        if (purchase) {
            this.purchase = JSON.parse(purchase);
			// If the stored Id is different from URL params, then get the records of URL param id
			if (this.purchase._id !== this.id) {
				this.getPurchaseDetail();
			}
        } else {
			this.getPurchaseDetail();
		}
	}

	getPurchaseDetail() {
		this.loading = true;
		this._httpService.getRecord('purchases/' + this.id, {}).subscribe((response) => {
			this.purchase = response;
			this.loading = false;
		})
	}

}
