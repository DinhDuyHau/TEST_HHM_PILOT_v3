import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchDialogComponent } from './serach-dialog.component';
import { TableCustomModule } from '../form-control-custom/table-custom/table-custom.module';

@NgModule({
    declarations: [SearchDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatIconModule,
        TableCustomModule
    ],
    exports: [SearchDialogComponent],
})
export class SearchDialogModule { }
