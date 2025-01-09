import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesStatsComponent } from './sales-stats.component';

@NgModule({
  declarations: [
    SalesStatsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SalesStatsComponent]
})
export class SalesStatsModule { }
