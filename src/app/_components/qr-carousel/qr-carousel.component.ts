import { Component, Input } from '@angular/core';
import { TransferMBDetail } from '@app/sales-management/model/ticket/common-model/payment.model';

@Component({
  selector: 'app-qr-carousel',
  templateUrl: './qr-carousel.component.html',
  styleUrls: ['./qr-carousel.component.scss']
})
export class QrCarouselComponent {
  @Input() qrList: TransferMBDetail[] = [];
  @Input() currentSlide = 0;

  get visibleQrList(): TransferMBDetail[] {
    return (this.qrList || []).filter(qr => !!qr.qrText);
  }
}
