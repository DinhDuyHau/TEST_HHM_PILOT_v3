import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavigationVoucherComponent } from './navigation-voucher.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    NavigationVoucherComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatTooltipModule
  ],
  exports: [
    NavigationVoucherComponent
  ]
})
export class NavigationVoucheModule { }
