import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@app/_components/grid/grid.module';
import { MatButtonModule } from '@angular/material/button';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { FormPaymentCustomModule } from '../../form-control-custom/form-payment-custom/form-payment-custom.module';
import { FormInputCustomModule } from '../../form-control-custom/form-input-custom/form-input-custom.module';
import { DropdownCustomModule } from '../../form-control-custom/dropdown/dropdown.module';
import { DepositSelectModule } from '../../deposit/deposit-select.module';
import { EInvoiceTabComponent } from './e-invoice-tab.component';



@NgModule({
  declarations: [
    EInvoiceTabComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    GridModule,
    MatButtonModule,
    DataFormatPipeModule,
    FormPaymentCustomModule,
    FormInputCustomModule,
    DropdownCustomModule,
    DepositSelectModule,
  ],
  exports: [
    EInvoiceTabComponent
  ]
})
export class EInvoiceTabModule { }
