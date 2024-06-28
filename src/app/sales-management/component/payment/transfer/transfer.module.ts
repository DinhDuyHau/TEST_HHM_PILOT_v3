import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferComponent } from './transfer.component';
import { TableCustomModule } from '../../form-control-custom/table-custom/table-custom.module';
import { FormPaymentCustomModule } from '../../form-control-custom/form-payment-custom/form-payment-custom.module';

@NgModule({
  declarations: [
    TransferComponent
  ],
  imports: [
    CommonModule,
    TableCustomModule,
    FormPaymentCustomModule,
  ]
})
export class TransferModule { }
