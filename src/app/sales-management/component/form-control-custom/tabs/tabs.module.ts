import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsCustomComponent } from './tabs.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { TabCustomModule } from '../tab/tab.module';

@NgModule({
    declarations: [TabsCustomComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormsModule,
        TabCustomModule,
    ],
    exports: [TabsCustomComponent],

})
export class TabsCustomModule { }
