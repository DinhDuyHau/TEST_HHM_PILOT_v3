import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockTransferComponent } from './stock-transfer.component';
import { MatIconModule } from '@angular/material/icon';
import { SearchDialogModule } from '@app/sales-management/component/search/serach-dialog.module';
import { PaymentTabModule } from '@app/sales-management/component/payment/payment-tab/payment-tab.module';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { TabCustomModule } from '@app/sales-management/component/form-control-custom/tab/tab.module';
import { FormInputCustomModule } from '@app/sales-management/component/form-control-custom/form-input-custom/form-input-custom.module';
import { FormCheckboxCustomModule } from '@app/sales-management/component/form-control-custom/form-checkbox-custom/form-checkbox-custom.module';
import { FormSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-select-custom/form-select-custom.module';
import { TableCustomModule } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.module';
import { TabsCustomModule } from '@app/sales-management/component/form-control-custom/tabs/tabs.module';
import { ScanQrcodeModule } from '@app/_components/scan-qrcode/scan-qrcode.module';
import { CameraModule } from '@app/sales-management/component/webcam/webcam.module';
import { EInvoiceTabModule } from '@app/sales-management/component/e-invoice/e-invoice-tab/e-invoice-tab.module';
import { EInvoiceInfoModule } from '@app/sales-management/component/e-invoice/e-invoice-info/e-invoice-info.module';
import { VoucherInfoModule } from '@app/sales-management/component/form-control-custom/voucher-info/voucher-info.module';
import { PackageForImeiModule } from '@app/sales-management/component/merchandise-service/package-for-imei/package-for-imei.module';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        SearchDialogModule,
        DataFormatPipeModule,
        TabsCustomModule,
        TabCustomModule,
        FormInputCustomModule,
        FormCheckboxCustomModule,
        FormSelectCustomModule,
        TableCustomModule,
        PaymentTabModule,
        ScanQrcodeModule,
        CameraModule,
        EInvoiceTabModule,
        EInvoiceInfoModule,
        VoucherInfoModule,
        PackageForImeiModule,
    ],
    declarations: [
        StockTransferComponent
    ],
    exports: [
        StockTransferComponent
    ],
})
export class StockTransferlModule { }