import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCustomComponent } from './table-custom.component';
import { MatIconModule } from '@angular/material/icon';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { FormInputCustomModule } from '../form-input-custom/form-input-custom.module';



@NgModule({
  declarations: [
    TableCustomComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    DataFormatPipeModule,
    MatCheckboxModule,
    FormsModule,
    FormInputCustomModule,
  ],
  exports: [TableCustomComponent],
})
export class TableCustomModule { }
