import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@app/_components/grid/grid.module';
import { DirModule } from '@app/_components/dir/dir.module';
import { RouterModule } from '@angular/router';
import { PrinterModule } from '@app/_components/printer/printer.module';
import { LookupModule } from '@app/_components/lookup/lookup.module';
import { ControlsModule } from '@app/_components/controls/controls.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { RefundBaokimComponent } from './refund-baokim.component';
import { GridV2Module } from '@app/_components/gridV2/gridV2.module';
import { TabCustomModule } from '@app/sales-management/component/form-control-custom/tab/tab.module';
import { TabsCustomModule } from '@app/sales-management/component/form-control-custom/tabs/tabs.module';
import { RefundBaokimDetailComponent } from './create/create.component';
import { PaymentTabModule } from '@app/sales-management/component/payment/payment-tab/payment-tab.module';
import { VoucherInfoModule } from '@app/sales-management/component/form-control-custom/voucher-info/voucher-info.module';
import { VoucherInfoHeaderModule } from '@app/sales-management/component/voucher-info-header/voucher-info-header.module';
import { NavigationVoucheModule } from '@app/sales-management/component/navigation-voucher/navigation-voucher.module';
@NgModule({
  declarations: [RefundBaokimComponent, RefundBaokimDetailComponent],
  imports: [
    CommonModule,
    DirModule,
    RouterModule,
    PrinterModule,
    LookupModule,
    ControlsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTabsModule,
    GridModule,
    GridV2Module,
    MatInputModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    TabCustomModule,
    TabsCustomModule,
    PaymentTabModule,
    VoucherInfoModule,
    NavigationVoucheModule,
    VoucherInfoHeaderModule
  ],
  exports: [RefundBaokimComponent, RefundBaokimDetailComponent]
})
export class RefundBaokimModule { }
