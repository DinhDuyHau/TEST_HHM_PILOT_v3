import { NgModule, createComponent } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SaleRenewComponent } from './sale-renew.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GridModule } from '@app/_components/grid/grid.module';
import { SearchDialogModule } from '../../component/search/serach-dialog.module';
import { PaymentTabModule } from '@app/sales-management/component/payment/payment-tab/payment-tab.module';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { FormCheckboxCustomModule } from '@app/sales-management/component/form-control-custom/form-checkbox-custom/form-checkbox-custom.module';
import { FormInputCustomModule } from '@app/sales-management/component/form-control-custom/form-input-custom/form-input-custom.module';
import { FormSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-select-custom/form-select-custom.module';
import { TabCustomModule } from '@app/sales-management/component/form-control-custom/tab/tab.module';
import { TableCustomModule } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.module';
import { TabsCustomModule } from '@app/sales-management/component/form-control-custom/tabs/tabs.module';
import { EInvoiceTabModule } from '@app/sales-management/component/e-invoice/e-invoice-tab/e-invoice-tab.module';
import { EInvoiceInfoModule } from '@app/sales-management/component/e-invoice/e-invoice-info/e-invoice-info.module';
import { VoucherInfoModule } from '@app/sales-management/component/form-control-custom/voucher-info/voucher-info.module';
import { ControlsModule } from '@app/_components/controls/controls.module'
import { OldProductDialogComponent } from './old-product-dialog.component';
import { VoucherInfoHeaderModule } from '@app/sales-management/component/voucher-info-header/voucher-info-header.module';
import { NavigationVoucheModule } from '@app/sales-management/component/navigation-voucher/navigation-voucher.module';

@NgModule({
    declarations: [
        SaleRenewComponent,
        OldProductDialogComponent
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
        FormsModule,
        GridModule,
        SearchDialogModule,
        PaymentTabModule,
        TabsCustomModule,
        TabCustomModule,
        FormInputCustomModule,
        FormCheckboxCustomModule,
        FormSelectCustomModule,
        TableCustomModule,
        EInvoiceTabModule,
        EInvoiceInfoModule,
        DataFormatPipeModule,
        VoucherInfoModule,
        ControlsModule,
        NavigationVoucheModule,
        VoucherInfoHeaderModule
    ]
})
export class SaleRenewModule { }
