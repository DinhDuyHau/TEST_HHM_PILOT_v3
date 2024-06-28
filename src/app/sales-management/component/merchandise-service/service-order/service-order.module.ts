import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceOrderComponent } from './service-order.component';
import { TableCustomModule } from '../../form-control-custom/table-custom/table-custom.module';
import { FormInputCustomModule } from '../../form-control-custom/form-input-custom/form-input-custom.module';

@NgModule({
    declarations: [ServiceOrderComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        TableCustomModule,
        FormInputCustomModule
    ],
    exports: [ServiceOrderComponent],

})
export class ServiceOrderModule { }
