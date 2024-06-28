import { NgModule, createComponent } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleWithTelecomComponent } from './sale-with-telecom.component';
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
import { TabsCustomModule } from '@app/sales-management/component/form-control-custom/tabs/tabs.module';
import { TabCustomModule } from '@app/sales-management/component/form-control-custom/tab/tab.module';
import { FormInputCustomModule } from '@app/sales-management/component/form-control-custom/form-input-custom/form-input-custom.module';
import { FormSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-select-custom/form-select-custom.module';
import { TableCustomModule } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.module';
import { EInvoiceTabModule } from '@app/sales-management/component/e-invoice/e-invoice-tab/e-invoice-tab.module';
import { EInvoiceInfoModule } from '@app/sales-management/component/e-invoice/e-invoice-info/e-invoice-info.module';
import { DataFormatPipeModule } from '../../../_pipe/dataFormat/data-format.pipe';
import { VoucherInfoModule } from '@app/sales-management/component/form-control-custom/voucher-info/voucher-info.module';

@NgModule({
    declarations: [
        SaleWithTelecomComponent
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
        FormSelectCustomModule,
        TableCustomModule,
        EInvoiceTabModule,
        EInvoiceInfoModule,
        DataFormatPipeModule,
        VoucherInfoModule
    ]
})
export class SaleWithTelecomModule { }