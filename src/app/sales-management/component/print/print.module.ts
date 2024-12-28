import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrintComponent } from './print.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    PrintComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatTooltipModule
  ],
  exports: [
    PrintComponent
  ]
})
export class PrintModule { }
