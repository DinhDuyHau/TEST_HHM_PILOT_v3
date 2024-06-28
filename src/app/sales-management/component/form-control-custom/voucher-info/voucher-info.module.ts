import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherInfoComponent } from './voucher-info.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VoucherInfoDialogComponent } from './voucher-info-dialog/voucher-info-dialog.component';



@NgModule({
  declarations: [
    VoucherInfoComponent,
    VoucherInfoDialogComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    VoucherInfoComponent
  ]
})
export class VoucherInfoModule { }
