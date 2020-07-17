import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';

import { AppRoutingModule } from '../../app.routing';
import { AppMaterialModule } from '../../app.material'; 

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  exports: [HeaderComponent]
})

export class HeaderModule { }
