import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrinterComponent } from './printer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';



@NgModule({
  declarations: [PrinterComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    PdfViewerModule
  ],
  exports: [PrinterComponent]
})
export class PrinterModule { }
