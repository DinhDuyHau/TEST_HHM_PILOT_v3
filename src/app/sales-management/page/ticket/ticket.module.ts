import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketComponent } from './ticket.component';
import { FormsModule } from '@angular/forms';
import { DataFormatPipeModule } from '@app/_pipe/dataFormat/data-format.pipe';
import { TableCustomModule } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        TicketComponent
    ],
    exports: [TicketComponent],
    imports: [
        CommonModule,
        DataFormatPipeModule,
        TableCustomModule,
        PdfViewerModule,
        MatMenuModule,
        FontAwesomeModule
    ]
})
export class TicketModule { }