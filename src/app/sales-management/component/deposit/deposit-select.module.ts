import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@app/_components/grid/grid.module';
import { MatButtonModule } from '@angular/material/button';
import { DepositSelectComponent } from './deposit-select.component';
import { TableCustomModule } from '../form-control-custom/table-custom/table-custom.module';

@NgModule({
    declarations: [DepositSelectComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatIconModule,
        GridModule,
        MatButtonModule,
        TableCustomModule
    ],
    exports: [DepositSelectComponent],

})
export class DepositSelectModule { }
