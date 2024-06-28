import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormCheckboxCustomComponent } from './form-checkbox-custom.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [FormCheckboxCustomComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [FormCheckboxCustomComponent]
})
export class FormCheckboxCustomModule { }
