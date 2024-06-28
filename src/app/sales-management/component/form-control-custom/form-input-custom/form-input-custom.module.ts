import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputCustomComponent } from './form-input-custom.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';

@NgModule({
    declarations: [FormInputCustomComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormsModule,
        DataFormatPipeModule
    ],
    exports: [FormInputCustomComponent],

})
export class FormInputCustomModule { }
