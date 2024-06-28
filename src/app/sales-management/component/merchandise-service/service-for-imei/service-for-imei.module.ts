import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceForImeiComponent } from './service-for-imei.component';
import { TableCustomModule } from '../../form-control-custom/table-custom/table-custom.module';
import { FormInputCustomModule } from '../../form-control-custom/form-input-custom/form-input-custom.module';

@NgModule({
    declarations: [ServiceForImeiComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        TableCustomModule,
        FormInputCustomModule
    ],
    exports: [ServiceForImeiComponent],

})
export class ServiceForImeiModule { }
