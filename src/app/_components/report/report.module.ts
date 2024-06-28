import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { GridV2Module } from '../gridV2/gridV2.module';



@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    GridV2Module
  ],
  exports: [ReportComponent]
})
export class ReportModule { }
