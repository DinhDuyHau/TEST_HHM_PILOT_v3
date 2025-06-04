import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { Payment } from '@app/_services';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'e-invoice-info',
  templateUrl: './e-invoice-info.component.html',
  styleUrls: ['./e-invoice-info.component.scss']
})
export class EInvoiceInfoComponent implements OnChanges {
  @Input() data!: any;
  @Input() disabled = false;
  @Input() xuat_yn = true;

  @Output() handleChangeData = new EventEmitter<any>();

  payment!: any[];
  einvoiceObject!: any[];
  constructor(private paymentService: Payment, private commonService: CommonService) {
    this.paymentService.getPaymentInvoice(this.xuat_yn).subscribe(result => {
      this.payment = result;
      if (this.data && this.data.hd_httt && this.data.hd_httt.trim() == '' && this.payment && this.payment.length > 0) {
        this.data.hd_httt = this.payment[0].ma_httt;
      }
    });

    this.einvoiceObject = [
      { ma: '0', ten: 'Cá nhân' },
      { ma: '1', ten: 'Doanh nghiệp' },
    ];
  }

  handleChangeTaxCode(event: string) {
    this.commonService.getCustomerInfoByTax(event).subscribe((result: any) => {
      if (result.success) {
        this.data.hd_dia_chi = result.result.dia_chi;
        this.data.hd_ten_kh = result.result.ten_kh;
      }
      else {
        this.commonService.showMessageByName(result.message);
      }
    });
  }
  ngOnChanges(changes: any) {
    if (this.data && this.data.hd_httt && this.data.hd_httt.trim() == '' && this.payment && this.payment.length > 0) {
      this.data.hd_httt = this.payment[0].ma_httt;
    }
  }
}
