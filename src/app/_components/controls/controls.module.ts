import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LookupDirective } from './lookup.directive';
import { InputComponent } from './input/input.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputCustomV2Component } from './input-custom-v2/input-custom-v2.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectCustomComponent } from './select-custom/select-custom.component';
import { DataFormatPipe, DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputDateComponent } from './input-date/input-date.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomNumberInputComponent } from './input-number/custom-number-input.component';


@NgModule({
  declarations: [
    LookupDirective,
    InputComponent,
    InputCustomV2Component,
    SelectCustomComponent,
    InputDateComponent,
    CheckboxComponent,
    CustomNumberInputComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule, DataFormatPipeModule, FontAwesomeModule, MatCheckboxModule
  ],
  providers: [DecimalPipe, DataFormatPipe],
  exports: [LookupDirective, InputComponent, InputCustomV2Component, SelectCustomComponent, InputDateComponent, CheckboxComponent, CustomNumberInputComponent]
})
export class ControlsModule { }
