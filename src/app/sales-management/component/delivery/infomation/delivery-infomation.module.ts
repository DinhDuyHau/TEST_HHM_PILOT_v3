import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DeliveryInfomationComponent } from './delivery-infomation.component';
import { GridModule } from '@app/_components/grid/grid.module';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { FormInputCustomModule } from "../../form-control-custom/form-input-custom/form-input-custom.module";

@NgModule({
    declarations: [DeliveryInfomationComponent],
    exports: [DeliveryInfomationComponent],
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
export class DeliveryInfomationModule { }
