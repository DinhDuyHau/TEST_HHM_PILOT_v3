import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogInputCustomComponent } from './dialog-input-custom.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ControlsModule } from '@app/_components/controls/controls.module';



@NgModule({
  declarations: [
    DialogInputCustomComponent
  ],
  imports: [
    CommonModule, MatIconModule, FormsModule, MatSnackBarModule, ControlsModule
  ],
  exports: [DialogInputCustomComponent]
})
export class DialogInputCustomModule { }
