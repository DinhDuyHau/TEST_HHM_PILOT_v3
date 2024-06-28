import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSelectCustomComponent } from './form-select-custom.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [FormSelectCustomComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
  ],
  exports: [FormSelectCustomComponent]
})
export class FormSelectCustomModule { }
