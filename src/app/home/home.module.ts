import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home.routing';
import { HomeComponent } from './home.component';
import { CategoryModule } from '@app/_components/category/category.module';
import { ControlsModule } from '@app/_components/controls/controls.module';
import { FilterModule } from '@app/_components/filter/filter.module';
import { ReportModule } from '@app/_components/report/report.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HomeRoutingModule,
        CategoryModule,
        FilterModule,
        ReportModule,
    ],
    declarations: [
        HomeComponent
    ],
    exports: [
    ],
})
export class HomeModule { }