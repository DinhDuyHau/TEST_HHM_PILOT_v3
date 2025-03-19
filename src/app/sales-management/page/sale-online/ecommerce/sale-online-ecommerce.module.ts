import { NgModule, createComponent } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleOnlineEcommerceComponent } from './sale-online-ecommerce.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GridModule } from '@app/_components/grid/grid.module';
import { DiscountSelectModule } from '@app/sales-management/component/discount/select/discount-select.module';
import { PaymentTabModule } from '@app/sales-management/component/payment/payment-tab/payment-tab.module';
import { FormsModule } from '@angular/forms';
import { DeliveryInfomationModule } from '@app/sales-management/component/delivery/infomation/delivery-infomation.module';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { SearchDialogModule } from '@app/sales-management/component/search/serach-dialog.module';
import { OrderInfomationModule } from '@app/sales-management/component/ecommerce/order-infomation/order-infomation.module';
import { FormInputCustomModule } from '@app/sales-management/component/form-control-custom/form-input-custom/form-input-custom.module';
import { FormSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-select-custom/form-select-custom.module';
import { FormCheckboxCustomModule } from '@app/sales-management/component/form-control-custom/form-checkbox-custom/form-checkbox-custom.module';
import { TableCustomModule } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.module';
import { TabsCustomModule } from '@app/sales-management/component/form-control-custom/tabs/tabs.module';
import { TabCustomModule } from '@app/sales-management/component/form-control-custom/tab/tab.module';
import { EInvoiceTabModule } from '@app/sales-management/component/e-invoice/e-invoice-tab/e-invoice-tab.module';
import { EInvoiceInfoModule } from '@app/sales-management/component/e-invoice/e-invoice-info/e-invoice-info.module';
import { VoucherInfoModule } from '@app/sales-management/component/form-control-custom/voucher-info/voucher-info.module';
import { EcommerceDialogComponent } from './ecommerce-dialog/ecommerce-dialog.component';
import { VoucherInfoHeaderModule } from '@app/sales-management/component/voucher-info-header/voucher-info-header.module';
import { NavigationVoucheModule } from '@app/sales-management/component/navigation-voucher/navigation-voucher.module';
import { SendEmailModule } from '@app/sales-management/component/send-email/send-email.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule,
    GridModule,
    SearchDialogModule,
    PaymentTabModule,
    DeliveryInfomationModule,
    DataFormatPipeModule,
    OrderInfomationModule,
    FormCheckboxCustomModule,
    FormInputCustomModule,
    TableCustomModule,
    FormSelectCustomModule,
    TabsCustomModule,
    TabCustomModule,
    EInvoiceTabModule,
    EInvoiceInfoModule,
    VoucherInfoModule,
    NavigationVoucheModule,
    VoucherInfoHeaderModule,
    SendEmailModule
  ],
  declarations: [
    SaleOnlineEcommerceComponent,
    EcommerceDialogComponent
  ],
  exports: [
    SaleOnlineEcommerceComponent, EcommerceDialogComponent
  ],
})
export class SaleOnlineEcommerceModule { }
