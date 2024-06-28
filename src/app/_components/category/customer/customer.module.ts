import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { GridModule } from '@app/_components/grid/grid.module';
import { DirModule } from '@app/_components/dir/dir.module';
import { RouterModule } from '@angular/router';
import { PrinterModule } from '@app/_components/printer/printer.module';
import { LookupModule } from '@app/_components/lookup/lookup.module';
import { CreateCustomerComponent } from './create/create.component';
import { ControlsModule } from '@app/_components/controls/controls.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { GridV2Module } from '@app/_components/gridV2/gridV2.module';
import { TabsCustomModule } from '@app/sales-management/component/form-control-custom/tabs/tabs.module';
import { TabCustomModule } from '@app/sales-management/component/form-control-custom/tab/tab.module';


@NgModule({
  declarations: [CustomerComponent, CreateCustomerComponent],
  imports: [
    CommonModule,
    GridModule,
    GridV2Module,
    DirModule,
    RouterModule,
    PrinterModule,
    LookupModule,
    ControlsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    // BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    TabCustomModule,
    TabsCustomModule
  ],
  exports: [CustomerComponent, CreateCustomerComponent],
})
export class CustomerModule { }
