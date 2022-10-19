
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../app.material';
// Components
import { ErrorComponent } from './error/error.component';
import { LoaderComponent } from './loader/loader.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';

@NgModule({
  declarations: [
    ErrorComponent,
    LoaderComponent,
    EmptyStateComponent
  ],
  imports: [
    AppMaterialModule,
    CommonModule
  ],
  exports: [
    ErrorComponent,
    LoaderComponent,
    EmptyStateComponent
  ]
})
export class SharedModule { }
