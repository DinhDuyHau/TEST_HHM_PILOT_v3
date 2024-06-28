import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import { GridComponent } from './grid.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ResizeColumnDirective } from './resize-column.directive';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from '../dialog/dialog.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [GridComponent, ResizeColumnDirective],
  imports: [
    CommonModule,
    MatTableModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    BrowserModule,
    MatSortModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    DialogModule,
    DataFormatPipeModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  exports: [GridComponent],
})
export class GridModule { }
