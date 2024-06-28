import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabCustomComponent } from './tab.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [TabCustomComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormsModule,
    ],
    exports: [TabCustomComponent],

})
export class TabCustomModule { }
