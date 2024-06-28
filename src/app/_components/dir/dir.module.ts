import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirComponent } from './dir.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GridModule } from '../grid/grid.module';


@NgModule({
  declarations: [DirComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    GridModule
  ],
  exports: [DirComponent]
})
export class DirModule { }
