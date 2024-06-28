import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@app/_components/grid/grid.module';
import { MatButtonModule } from '@angular/material/button';
import { DiscountSelectComponent } from './discount-select.component';
import { TableCustomModule } from '../../form-control-custom/table-custom/table-custom.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [DiscountSelectComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatIconModule,
        GridModule,
        MatButtonModule,
        TableCustomModule,
        DragDropModule
    ],
    exports: [DiscountSelectComponent],

})
export class DiscountSelectModule { }
