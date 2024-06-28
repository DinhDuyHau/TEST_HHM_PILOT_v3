import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { GridV2Module } from '../gridV2/gridV2.module';



@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    GridV2Module,
  ],
  exports: [CategoryComponent]
})
export class CategoryModule { }
