import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSearchSelectCustomComponent } from './form-search-select-custom.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [FormSearchSelectCustomComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
  ],
  exports: [FormSearchSelectCustomComponent]
})
export class FormSearchSelectCustomModule { }
