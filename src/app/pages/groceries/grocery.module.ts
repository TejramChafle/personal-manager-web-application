import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AppMaterialModule } from './../../app.material';

import { GroceriesComponent } from './groceries.component';
import { GroceryComponent } from './grocery/grocery.component';
import { ManageItemComponent } from './manage-item/manage-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
    { path: '', component: GroceriesComponent }
]

@NgModule({
    declarations: [
        GroceriesComponent,
        GroceryComponent,
        ManageItemComponent
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        RouterModule.forChild(routes),
        InfiniteScrollModule
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [
        GroceryComponent,
        ManageItemComponent
    ]
})

export class GroceryModuleClass {}