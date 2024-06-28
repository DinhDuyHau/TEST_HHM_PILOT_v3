import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogConfirmComponent } from './dialog-confirm.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    DialogConfirmComponent,
  ],
  imports: [
    CommonModule, MatIconModule, FormsModule, MatSnackBarModule
  ],
  exports: [DialogConfirmComponent]
})
export class DialogConfirmModule { }
