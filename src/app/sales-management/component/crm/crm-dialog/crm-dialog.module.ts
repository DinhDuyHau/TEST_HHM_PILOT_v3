import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmDialogComponent } from './crm-dialog.component';
import { FormInputCustomModule } from '../../form-control-custom/form-input-custom/form-input-custom.module';

@NgModule({
  declarations: [CrmDialogComponent],
  imports: [
    CommonModule,
    FormInputCustomModule
  ],
  exports: [CrmDialogComponent],
})
export class CrmDialogModule { }
