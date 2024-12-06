import { NgModule, createComponent } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleWholeComponent } from './sale-whole.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GridModule } from '@app/_components/grid/grid.module';
import { SearchDialogModule } from '../../component/search/serach-dialog.module';
import { PaymentTabModule } from '@app/sales-management/component/payment/payment-tab/payment-tab.module';
import { FormsModule } from '@angular/forms';
import { FormInputCustomModule } from '@app/sales-management/component/form-control-custom/form-input-custom/form-input-custom.module';
import { FormSearchSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-search-select-custom/form-search-select-custom.module';
import { FormSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-select-custom/form-select-custom.module';
import { TabsCustomModule } from '@app/sales-management/component/form-control-custom/tabs/tabs.module';
import { TabCustomModule } from '@app/sales-management/component/form-control-custom/tab/tab.module';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { DeliveryInfomationModule } from '@app/sales-management/component/delivery/infomation/delivery-infomation.module';
import { TableCustomModule } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.module';
import { FormUploadFileCustomModule } from '../../component/form-control-custom/form-upload-file-custom/form-upload-file-custom.module';
import { EInvoiceTabModule } from '@app/sales-management/component/e-invoice/e-invoice-tab/e-invoice-tab.module';
import { EInvoiceInfoModule } from '@app/sales-management/component/e-invoice/e-invoice-info/e-invoice-info.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VoucherInfoModule } from '@app/sales-management/component/form-control-custom/voucher-info/voucher-info.module';
import { VoucherInfoHeaderModule } from '@app/sales-management/component/voucher-info-header/voucher-info-header.module';
import { NavigationVoucheModule } from '@app/sales-management/component/navigation-voucher/navigation-voucher.module';

@NgModule({
    declarations: [
        SaleWholeComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatTabsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        DataFormatPipeModule,
        TabsCustomModule,
        TabCustomModule,
        FormsModule,
        GridModule,
        SearchDialogModule,
        PaymentTabModule,
        TableCustomModule,
        FormInputCustomModule,
        FormSearchSelectCustomModule,
        FormSelectCustomModule,
        DeliveryInfomationModule,
        FormUploadFileCustomModule,
        FontAwesomeModule,
        EInvoiceTabModule,
        EInvoiceInfoModule,
        VoucherInfoModule,
        NavigationVoucheModule,
        VoucherInfoHeaderModule
    ]
})
export class SaleWholeModule { }
