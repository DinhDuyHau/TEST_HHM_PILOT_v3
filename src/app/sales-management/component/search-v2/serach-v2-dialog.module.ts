import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchV2DialogComponent } from './serach-v2-dialog.component';
import { TableCustomModule } from '../form-control-custom/table-custom/table-custom.module';

@NgModule({
    declarations: [SearchV2DialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatIconModule,
        TableCustomModule
    ],
    exports: [SearchV2DialogComponent],
})
export class SearchV2DialogModule { }
