import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { FormInputCustomModule } from '@app/sales-management/component/form-control-custom/form-input-custom/form-input-custom.module';
import { FormCheckboxCustomModule } from '@app/sales-management/component/form-control-custom/form-checkbox-custom/form-checkbox-custom.module';
import { FormSelectCustomModule } from '@app/sales-management/component/form-control-custom/form-select-custom/form-select-custom.module';
import { TableCustomModule } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.module';
import { ScanQrcodeModule } from '@app/_components/scan-qrcode/scan-qrcode.module';
import { CameraModule } from '@app/sales-management/component/webcam/webcam.module';
import { ImportImeiComponent } from './import-imei.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataFormatPipeModule,
        FormInputCustomModule,
        FormCheckboxCustomModule,
        FormSelectCustomModule,
        TableCustomModule,
        ScanQrcodeModule,
        CameraModule,
    ],
    declarations: [
        ImportImeiComponent
    ],
    exports: [
        ImportImeiComponent
    ],
})
export class ImportImeiModule { }