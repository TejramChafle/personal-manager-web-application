import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Components
import { NavigationComponent } from './navigation/navigation.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { SearchComponent } from './search/search.component';
import { SortComponent } from './sort/sort.component';
import { BrowseComponent } from './browse/browse.component';
import { AppMaterialModule } from '../app.material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FilterPipe } from '../pipes/filter.pipe';

@NgModule({
  declarations: [
    NavigationComponent,
    ConfirmComponent,
    SearchComponent,
    SortComponent,
    BrowseComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    RouterModule
  ],
  entryComponents: [
    ConfirmComponent,
    SearchComponent,
    SortComponent,
    BrowseComponent
  ],
  exports: [
    NavigationComponent
  ]
})
export class ComponentsModule { }
