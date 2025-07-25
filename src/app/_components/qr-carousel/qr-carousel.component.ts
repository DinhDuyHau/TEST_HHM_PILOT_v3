import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransferMBDetail } from '@app/sales-management/model/ticket/common-model/payment.model';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { DialogConfirmComponent } from '../dialog/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-qr-carousel',
  templateUrl: './qr-carousel.component.html',
  styleUrls: ['./qr-carousel.component.scss']
})
export class QrCarouselComponent {
  @Input() qrList: TransferMBDetail[] = [];
  @Input() currentSlide = 0;
  @Output() handleDeleteQr = new EventEmitter<{ item: any }>();

  constructor(
    private commonService: CommonService,
  ) { }

  get visibleQrList(): TransferMBDetail[] {
    return (this.qrList || []).filter(qr => !!qr.qrText);
  }

  deleteQr(qr: any) {
    this.commonService.openDialog(DialogConfirmComponent, { title: 'Bạn có chắc chắn muốn xóa QR này?' })
      .afterClosed().subscribe(result => {
        if (result) {
          this.handleDeleteQr.emit({ item: qr });
        }
      });
  }
}
