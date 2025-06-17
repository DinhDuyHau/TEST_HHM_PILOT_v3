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
  typePapers!: any[];
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

    this.typePapers = [
      { ma: '', ten: 'Chọn loại giấy tờ' },
      { ma: '1', ten: 'CCCD' },
      { ma: '3', ten: 'Hộ chiếu' },
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

  handleChange($event: any, fileds: string) {
    if(fileds == 'hd_nguoi_mua' && $event.length > 200) {
      this.commonService.showMessageByName('invoice_buyerName_info');
      return;
    }

    if(fileds == 'hd_loai_giay_to' && !/^$|^1$|^3$/.test($event)) {
      this.commonService.showMessageByName('invoice_buyerIdType_info');
      return;
    }

    if(fileds == 'hd_so_giay_to' && $event.length > 100) {
      this.commonService.showMessageByName('invoice_buyerIdNo_info');
      return;
    }

    this.data[fileds] = $event;
  }

  handleChangeObjectInvoice($event: any) {
    // xử lý ô tên đơn vị, địa chỉ khi đối tượng là doanh nghiệp
    if($event == '1') {
      this.data.hd_ten_kh = this.data.hd_ten_kh ? this.data.hd_ten_kh : this.data.ten_kh;
      this.data.hd_dia_chi = this.data.hd_dia_chi ? this.data.hd_dia_chi : this.data.dia_chi;
    } else {
      this.data.hd_ten_kh = '';
      this.data.hd_dia_chi = '';
    }

    this.data.fnote2 = $event;
  }
}
