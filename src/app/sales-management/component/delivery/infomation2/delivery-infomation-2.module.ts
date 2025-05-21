import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DeliveryInfomationComponent2 } from './delivery-infomation-2.component';
import { GridModule } from '@app/_components/grid/grid.module';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { FormInputCustomModule } from "../../form-control-custom/form-input-custom/form-input-custom.module";

@NgModule({
    declarations: [DeliveryInfomationComponent2],
    exports: [DeliveryInfomationComponent2],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        FormsModule,
        DataFormatPipeModule,
        MatIconModule,
        FormInputCustomModule
    ]
})
export class DeliveryInfomationModule2 { }
