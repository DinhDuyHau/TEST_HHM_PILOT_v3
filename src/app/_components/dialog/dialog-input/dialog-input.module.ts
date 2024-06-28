import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogInputComponent } from './dialog-input.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ControlsModule } from '@app/_components/controls/controls.module';



@NgModule({
  declarations: [
    DialogInputComponent
  ],
  imports: [
    CommonModule, MatIconModule, FormsModule, MatSnackBarModule, ControlsModule
  ],
  exports: [DialogInputComponent]
})
export class DialogInputModule { }
