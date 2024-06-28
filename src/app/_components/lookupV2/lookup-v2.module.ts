import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LookupV2Component } from './lookup-v2.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GridModule } from '../grid/grid.module';
import { CustomerService } from '../category/customer/customer.service';
import { GridV2Module } from '../gridV2/gridV2.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    GridModule,
    GridV2Module
  ],
  exports: []
})
export class LookupV2Module { }
