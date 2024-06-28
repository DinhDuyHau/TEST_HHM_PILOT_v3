import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EInvoiceInfo } from '@app/sales-management/model/dto/einvoice.dto';

@Component({
  selector: 'e-invoice-tab',
  templateUrl: './e-invoice-tab.component.html',
  styleUrls: ['./e-invoice-tab.component.scss']
})
export class EInvoiceTabComponent {
  @Input() data!: EInvoiceInfo;

}
