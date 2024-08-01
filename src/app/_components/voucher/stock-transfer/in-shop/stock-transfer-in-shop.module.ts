import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockTransferInShopComponent } from './stock-transfer-in-shop.component';
import { MatIconModule } from '@angular/material/icon';
import { SearchDialogModule } from '@app/sales-management/component/search/serach-dialog.module';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { TabCustomModule } from '@app/sales-management/component/form-control-custom/tab/tab.module';
import { FormInputCustomModule } from '@app/sales-management/component/form-control-custom/form-input-custom/form-input-custom.module';
import { FormCheckboxCustomModule } from '@app/sales-management/component/form-control-custom/form-checkbox-custom/form-checkbox-custom.module';
import { FormSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-select-custom/form-select-custom.module';
import { TableCustomModule } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.module';
import { TabsCustomModule } from '@app/sales-management/component/form-control-custom/tabs/tabs.module';
import { ScanQrcodeModule } from '@app/_components/scan-qrcode/scan-qrcode.module';
import { CameraModule } from '@app/sales-management/component/webcam/webcam.module';
import { ImportImeiModule } from '../import-imei/import-imei.module';
import { VoucherInfoModule } from '@app/sales-management/component/form-control-custom/voucher-info/voucher-info.module';

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
        ScanQrcodeModule,
        CameraModule,
        VoucherInfoModule,
        ImportImeiModule
    ],
    declarations: [
        StockTransferInShopComponent,
    ],
    exports: [
        StockTransferInShopComponent
    ],
})
export class StockTransferInShoplModule { }