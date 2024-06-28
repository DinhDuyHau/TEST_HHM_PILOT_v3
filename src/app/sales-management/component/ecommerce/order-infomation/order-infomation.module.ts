import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { OrderInfomationComponent } from './order-infomation.component';
import { GridModule } from '@app/_components/grid/grid.module';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { FormInputCustomModule } from '../../form-control-custom/form-input-custom/form-input-custom.module';
import { FormSelectCustomModule } from '../../form-control-custom/form-select-custom/form-select-custom.module';
import { ControlsModule } from '@app/_components/controls/controls.module';

@NgModule({
    declarations: [OrderInfomationComponent],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        FormsModule,
        DataFormatPipeModule,
        FormInputCustomModule,
        FormSelectCustomModule,
        ControlsModule,
    ],
    exports: [OrderInfomationComponent],

})
export class OrderInfomationModule { }
