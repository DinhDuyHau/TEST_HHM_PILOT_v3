import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogIMEIComponent } from './dialog-imei/dialog-imei.component';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogInputModule } from './dialog-input/dialog-input.module';
import { DialogInputCustomModule } from './dialog-input-custom/dialog-input-custom.module';



@NgModule({
  declarations: [
    DialogComponent,
    DialogIMEIComponent
  ],
  imports: [
    CommonModule, MatIconModule, FormsModule, MatSnackBarModule, DialogInputModule, DialogInputCustomModule
  ],
  exports: [DialogComponent]
})
export class DialogModule { }
