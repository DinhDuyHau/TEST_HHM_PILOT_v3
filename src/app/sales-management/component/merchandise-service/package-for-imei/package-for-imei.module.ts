import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { PackageForImeiComponent } from './package-for-imei.component';
import { TableCustomModule } from '../../form-control-custom/table-custom/table-custom.module';
import { FormInputCustomModule } from '../../form-control-custom/form-input-custom/form-input-custom.module';

@NgModule({
    declarations: [PackageForImeiComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        TableCustomModule,
        FormInputCustomModule
    ],
    exports: [PackageForImeiComponent],

})
export class PackageForImeiModule { }
