import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownCustomComponent } from './dropdown.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [DropdownCustomComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormsModule,
    ],
    exports: [DropdownCustomComponent],

})
export class DropdownCustomModule { }
