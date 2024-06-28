import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EWalletComponent } from './e-wallet.component';
import { TableCustomModule } from '../../form-control-custom/table-custom/table-custom.module';
import { FormPaymentCustomModule } from '../../form-control-custom/form-payment-custom/form-payment-custom.module';

@NgModule({
  declarations: [
    EWalletComponent
  ],
  imports: [
    CommonModule,
    TableCustomModule,
    FormPaymentCustomModule,
  ]
})
export class EWalletModule { }
