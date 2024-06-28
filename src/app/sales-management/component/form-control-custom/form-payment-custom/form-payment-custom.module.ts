import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPaymentCustomComponent } from './form-payment-custom.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { DataFormatPipeModule } from "../../../../_pipe/dataFormat/data-format.pipe";

@NgModule({
    declarations: [FormPaymentCustomComponent],
    exports: [FormPaymentCustomComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormsModule,
        DataFormatPipeModule
    ]
})
export class FormPaymentCustomModule { }
