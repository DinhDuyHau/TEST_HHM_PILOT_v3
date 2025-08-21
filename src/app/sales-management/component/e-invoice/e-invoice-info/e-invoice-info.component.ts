import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CustomerService, Payment } from '@app/_services';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'e-invoice-info',
  templateUrl: './e-invoice-info.component.html',
  styleUrls: ['./e-invoice-info.component.scss']
})
export class EInvoiceInfoComponent implements OnChanges {
  //@Input() data!: any;
  @Input() disabled = false;
  @Input() xuat_yn = true;
  @Input() entity = '';

  private _data: any;
  @Input() set data(val: any) {
    this._data = val;
    if (this._data?.ten_kh) {
      this._data.hd_nguoi_mua = this._data.ten_kh;
    }
  }

  get data(): any {
    return this._data;
  }


  @Output() handleChangeData = new EventEmitter<any>();

  payment!: any[];
  einvoiceObject!: any[];
  typePapers!: any[];
  constructor(
    private paymentService: Payment,
    private commonService: CommonService,
    private customerService: CustomerService,
  ) {
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
    this.data.hd_ten_kh = '';
    this.data.hd_dia_chi = '';
    this.commonService.getCustomerInfoByTax(event).subscribe((result: any) => {
      if (result.success) {
        this.data.hd_dia_chi = result.result.dia_chi;
        this.data.hd_ten_kh = result.result.ten_kh;
      }
      else {
        if (event)
          this.commonService.showMessageByName(result.message);
      }
    });
  }
  ngOnChanges(changes: any) {
    if (this.data && this.data.hd_httt && this.data.hd_httt.trim() == '' && this.payment && this.payment.length > 0) {
      this.data.hd_httt = this.payment[0].ma_httt;
    }

    if (this.entity == 'SVTran_BHD') {
      this.handleChangeObjectInvoice('1');
      this.data.xtag = '1';

      // lấy thông tin thuế theo shop
      const userJson = localStorage.getItem('user');
      const userObj = userJson !== null && JSON.parse(userJson);
      const shop = userObj['shop'] || "";
      if (shop) {
        this.customerService.getInfoMobiphoneByShop(shop).subscribe(result => {
          if (result.success && result.result) {
            const info = result.result as any;
            this.data.hd_mst = info?.ma_so_thue || '';
            this.data.hd_dia_chi = info?.dia_chi || '';
            this.data.hd_ten_kh = info?.ten_kh || '';
          }
        })
      }
    }
  }

  handleChange($event: any, fileds: string) {
    if (fileds == 'hd_nguoi_mua' && $event.length > 200) {
      this.commonService.showMessageByName('invoice_buyerName_info');
      return;
    }

    if (fileds == 'hd_loai_giay_to' && !/^$|^1$|^3$/.test($event)) {
      this.commonService.showMessageByName('invoice_buyerIdType_info');
      return;
    }

    if (fileds == 'hd_so_giay_to' && $event.length > 100) {
      if ($event.length > 100) {
        this.commonService.showMessageByName('invoice_buyerIdNo_info');
        return;
      }

      const idType = this.data['hd_loai_giay_to'];

      if (idType == '1' && $event.length < 12) {
        this.commonService.showMessageByName('invoice_buyerIdNo_min12_info'); // CCCD phải đủ 12 ký tự
        return;
      }

      if (idType == '3' && $event.length > 20) {
        this.commonService.showMessageByName('invoice_buyerIdNo_max20_info'); // Hộ chiếu tối đa 20 ký tự
        return;
      }
    }

    this.data[fileds] = $event;
  }

  handleChangeObjectInvoice($event: any) {
    // xử lý ô tên đơn vị, địa chỉ khi đối tượng là doanh nghiệp
    if ($event == '1') {
      this.data.hd_ten_kh = this.data.hd_ten_kh ? this.data.hd_ten_kh : this.data.ten_kh;
      this.data.hd_dia_chi = this.data.hd_dia_chi ? this.data.hd_dia_chi : this.data.dia_chi;
    } else {
      this.data.xtag = '0';
      this.data.hd_ten_kh = '';
      this.data.hd_dia_chi = '';
    }

    this.data.fnote2 = $event;
  }

  handleCheck(checked: boolean) {
    this.data.xtag = checked ? '1' : '0';
  }
}
