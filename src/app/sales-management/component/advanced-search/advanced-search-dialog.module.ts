import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvancedSearchDialogComponent } from './advanced-search-dialog.component';
import { FormInputCustomModule } from '../form-control-custom/form-input-custom/form-input-custom.module';
import { TabCustomModule } from '../form-control-custom/tab/tab.module';
import { FormSelectCustomModule } from '../form-control-custom/form-select-custom/form-select-custom.module';
import { FormSearchSelectCustomModule } from '../form-control-custom/form-search-select-custom/form-search-select-custom.module';
import { ControlsModule } from '@app/_components/controls/controls.module';

@NgModule({
    declarations: [AdvancedSearchDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        FormsModule,
        FormInputCustomModule,
        FormSearchSelectCustomModule,
        TabCustomModule,
        FormSelectCustomModule,
        ControlsModule
    ],
    exports: [AdvancedSearchDialogComponent],
})
export class AdvancedSearchDialogModule { }
