import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { ControlsModule } from '../controls/controls.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    FilterComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    DragDropModule,
    MatCheckboxModule
  ],
  exports: [
    FilterComponent
  ]
})
export class FilterModule { }
