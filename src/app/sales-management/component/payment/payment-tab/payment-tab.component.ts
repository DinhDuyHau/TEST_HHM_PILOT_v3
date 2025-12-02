import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import dataFormat from '@app/_common/dataFormat';
import { DepositDetail, DiscountCode, PAYMENT_CODE, Payment, PaymentRequest, TransferDetail } from '@app/sales-management/model/ticket/common-model/payment.model';
import { MatDialog } from '@angular/material/dialog';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../search/serach-dialog.component';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { DepositSelectComponent } from '../../deposit/deposit-select.component';
import { POSModel } from '@app/sales-management/model/dto/pos.dto';
import { POSService } from '@app/sales-management/api/pos-api.service';
import { Language } from '@app/sales-management/page/common/language';
import { DiscountProgramService } from '@app/_components/lookup/discount_program/discount_program.service';
import { ViewDiscountProgramService } from '@app/_components/lookup/view_discount_program/view_discount_program.service';
import { SwipeCardComponent } from '../swipe-card/swipe-card.component';
import { EWalletComponent } from '../e-wallet/e-wallet.component';
import { TransferComponent } from '../transfer/transfer.component';
import { PaymentTabDialogComponent } from './payment-tab-dialog/payment-tab-dialog.component';
import { PaymentService } from '@app/sales-management/page/common/payment.service';
import { Button } from '@app/_components/gridV2/grid.model';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'payment-tab',
  templateUrl: './payment-tab.component.html',
  styleUrls: ['./payment-tab.component.scss']
})
export class PaymentTabComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() data!: Payment;
  @Input() t_tong_tien!: number;
  @Input() t_con_no!: number;
  @Input() t_da_tra!: number;
  @Input() t_gg!: number;
  @Input() t_dat_coc_max = 0;
  @Input() he_so_qd!: number;
  @Input() diem_qd_max = 0;
  @Input() depositSource: any[] = [];
  @Input() pay_hidden!: any;
  @Input() readonly = false;
  @Input() invalid = false;
  @Input() merchandise: any[] = [];
  @Input() isPaymentHH = false;
  @Input() buttons: Button[] = [];
  @Input() approveDiscount = '';
  @Input() disableChooseButton = false;
  @Input() hiddenChooseButton = false;

  @Input() ma_kh: string = '';
  @Input() ngay_ct: string = '';
  @Input() voucherCode: string = '';

  //load lại dữ liệu tiền đặt cọc, tạm ứng của khách hàng
  @Input() reloadDepositOnInit = true;

  // biến xác định là update hay save
  @Input() action: string = '';
  @Input() shop: string = '';
  @Input() so_ct: string = '';
  @Input() stt_rec: string = '';
  @Input() status: string = '';
  @Input() model_status: string = '';

  // khai báo flag để nhận diện tính hợp lệ (truyền vào từ component cha) => cho phép bật dialog thanh toán
  // Nhận callback từ component cha
  @Input() checkValidForPaymentDialog: () => Promise<boolean> | boolean = () => true;

  // khai báo khóa chức năng thanh toán ngay cả với user admin
  isAdminLock = true;

  user_authorization: { access_yn: boolean, sa_yn: boolean } = {
    access_yn: false,
    sa_yn: false
  };

  @Output() handleChangeValue = new EventEmitter<{ t_con_no: number; t_da_tra: number; t_gg: number; nguoi_duyet_ck: string; t_chi_phi: number, status: string }>();
  @Output() handleButton = new EventEmitter<string>();

  tong_no = 0;
  ma_gg = '';
  dataFormat = dataFormat;
  depositSelected = [];
  viewPayment: any[] = [];
  t_cp = 0;

  constructor(
    private dialog: MatDialog,
    private commonService: CommonService,
    private posService: POSService,
    private discountProgramService: DiscountProgramService,
    private viewDiscountProgramService: ViewDiscountProgramService,
    private paymentService: PaymentService
  ) {

  }

  ngOnInit(): void {
    this.user_authorization = JSON.parse(localStorage.getItem('authorization')!);
    if (this.user_authorization && this.user_authorization.sa_yn) this.isAdminLock = false;
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initViewPayment();
    //
  }

  isPaymentDisable() {
    return this.model_status === '2' || (this.isAdminLock && this.model_status === '3');
  }

  isShowPaymentButton() {
    return !this.hiddenChooseButton && this.model_status !== '2' && (!this.isAdminLock || this.model_status !== '3');
  }

  async onClickPaymentDialog() {
    if (this.disableChooseButton || this.hiddenChooseButton)
      return;

    // Lấy kết quả kiểm tra dữ liệu từ component cha, nếu hợp lệ mới bật dialog hình thức thanh toán
    const is_valid_data = await Promise.resolve(this.checkValidForPaymentDialog());
    if (!is_valid_data) return;

    this.commonService.openDialog(PaymentTabDialogComponent,
      {
        data: this.data,
        t_tong_tien: this.t_tong_tien,
        t_con_no: this.t_con_no,
        t_da_tra: this.t_da_tra,
        t_gg: this.t_gg,
        t_dat_coc_max: this.t_dat_coc_max,
        he_so_qd: this.he_so_qd,
        diem_qd_max: this.diem_qd_max,
        depositSource: this.depositSource,
        pay_hidden: this.pay_hidden,
        readonly: this.readonly,
        invalid: this.invalid,
        merchandise: this.merchandise,
        isPaymentHH: this.isPaymentHH,
        approveDiscount: this.approveDiscount,
        ma_kh: this.ma_kh,
        ngay_ct: this.ngay_ct,
        reloadDepositOnInit: this.reloadDepositOnInit,
        action: this.action,
        shop: this.shop,
        voucherCode: this.voucherCode,
        so_ct: this.so_ct,
        stt_rec: this.stt_rec,
        status: this.status
      }, 'search-style-dialog')
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.t_con_no = data.t_con_no;
          this.t_da_tra = data.t_da_tra;
          this.t_gg = data.t_gg;
          this.t_cp = data.t_chi_phi;
          if (this.model_status !== '3') this.status = data.status;        // chỉ cho thay đổi status nếu không phải trạng thái 'chờ phát hành'

          // this.approveDiscount = data.approveDiscount;
          this.approveDiscount = data.nguoi_duyet_ck;
          this.handleChangeValue.emit({ t_con_no: this.t_con_no, t_da_tra: this.t_da_tra, t_gg: this.t_gg, nguoi_duyet_ck: this.approveDiscount, t_chi_phi: this.t_cp, status: this.status });
          this.initViewPayment();
        }
        //this.onChange();
        // pos && this.handleAddPOS(pos)
      });
  }
  initViewPayment() {
    this.viewPayment = this.paymentService.convertPaymentRequest(this.data, this.voucherCode).filter(x => x.tien >= 0).map((item) => {
      const ma_ct_tragop = this.voucherCode === 'BHA' || this.voucherCode === 'BHK';
      switch (item.ma_thanhtoan) {
        case PAYMENT_CODE.CASH:
          return { payment: item.ten_thanhtoan, note: '', money: item.tien };
        case PAYMENT_CODE.TRANSFER:
          return { payment: item.ten_thanhtoan, note: `${item.ten_ngan_hang}`, money: item.tien };
        case PAYMENT_CODE.ATM:
          if (item.tra_gop_bank) {
            return {
              payment: item.ten_thanhtoan + ' (trả góp bank)',
              note: `ĐVTG: ${item.ma_dv_tragop} <br>
                Mã máy POS: ${item.ma_may_pos} <br>
                Số thẻ: ${item.so_the_nh} <br>
                Ngân hàng phát hành: ${item.tk_nh_nhan} <br>
                Mã chuẩn chi: ${item.ma_chuan_chi} <br>
                Số HĐ: ${item.so_hd_tragop} <br>
                Mã giao dịch: ${item.so_hd_vnpay} <br>
                Phí bảo hiểm: &nbsp;&nbsp; <strong>${formatNumber(item.tien_phi_bh, 'en-US')}</strong> <br>
                Phí quẹt thẻ: &nbsp;&nbsp; <strong>${formatNumber(item.phi_quetthe, 'en-US')}</strong> <br>
                Phí chuyển đổi:&nbsp;&nbsp;<strong>${formatNumber(item.phi_chuyendoi, 'en-US')}</strong> <br>
              ` + (ma_ct_tragop ? `<br> Kỳ hạn: ${item.gc_td2}` : ''),
              money: item.tien
            };
          }
          return { payment: `Quẹt thẻ tại Công ty - post ${item.ma_may_pos}, ${item.ten_may_pos}`, note: `Mã chuẩn chi: ${item.ma_chuan_chi}, Số thẻ: ${item.so_the_nh}`, money: item.tien };
        case PAYMENT_CODE.EWALLET:
          return { payment: item.ten_thanhtoan, note: `${item.vi_dien_tu}, Số HĐ: ${item.so_hd_vnpay}`, money: item.tien };
        case PAYMENT_CODE.VNPAY:
          return { payment: item.ten_thanhtoan, note: `Số HĐ: ${item.so_hd_vnpay}`, money: item.tien };
        case PAYMENT_CODE.INSTALLMENT:
          const hasVoucher = this.voucherCode === 'BHA' || this.voucherCode === 'BHK';

          return {
            payment: item.ten_thanhtoan,
            note: `Số HĐ: ${item.so_hd_tragop} <br>
              Phí bảo hiểm: <strong>${formatNumber(item.tien_phi_bh, 'en-US')}</strong> <br>
              ĐVTG: ${item.ma_dv_tragop} <br>
              Phí chuyển đổi: <strong>${formatNumber(item.phi_cd_tragop, 'en-US')}</strong>` +
              (hasVoucher
                ? `<br> Ghi chú: ${item.gc_td1} <br> Kỳ hạn: ${item.gc_td2}`
                : ''),
            money: item.tien
          };
        case PAYMENT_CODE.CONVERSION:
          return { payment: item.ten_thanhtoan, note: '', money: item.tien };
        case PAYMENT_CODE.DEPOSIT:
          return { payment: item.ten_thanhtoan, note: `Số c.từ đặt cọc: ${item.gc_td1 ? item.gc_td1 : ''}`, money: item.tien };
        case PAYMENT_CODE.DISCOUNTCODE:
          return { payment: item.ten_thanhtoan, note: `Mã GG: ${item.ma_gg}`, money: item.tien };
        case PAYMENT_CODE.DISCOUNTPROGRAMCRM:
          return { payment: item.ten_thanhtoan, note: `Mã CT: ${item.ma_ctr}, CODE: ${item.ma_gg}`, money: item.tien };
        case PAYMENT_CODE.CARDINSTALLMENT:
          return {
            payment: item.ten_thanhtoan,
            note: `ĐVTG: ${item.ma_dv_tragop} <br>
              Mã máy POS: ${item.ma_may_pos} <br>
              Số thẻ: ${item.so_the_nh} <br>
              Ngân hàng phát hành: ${item.tk_nh_nhan} <br>
              Mã chuẩn chi: ${item.ma_chuan_chi} <br>
              Số HĐ: ${item.so_hd_tragop} <br>
              Mã giao dịch: ${item.so_hd_vnpay} <br>
              Phí bảo hiểm: &nbsp;&nbsp; <strong>${formatNumber(item.tien_phi_bh, 'en-US')}</strong> <br>
              Phí quẹt thẻ: &nbsp;&nbsp; <strong>${formatNumber(item.phi_quetthe, 'en-US')}</strong> <br>
              Phí chuyển đổi:&nbsp;&nbsp;<strong>${formatNumber(item.phi_chuyendoi, 'en-US')}</strong> <br>
            ` + (ma_ct_tragop ? `<br> Kỳ hạn: ${item.gc_td2}` : ''),
            money: item.tien
          };
        case PAYMENT_CODE.VOUCHERPARNER:
          return { payment: item.ten_thanhtoan, note: `Đơn vị phát hành: ${item.ma_ctr}, mã voucher: ${item.ma_gg}, mã giao dịch: ${item.ma_chuan_chi}`, money: item.tien };
        case PAYMENT_CODE.MBQR:
          return { payment: item.ten_thanhtoan, note: `Mã FT: ${item.gc_td3}. ${item.ten_ngan_hang}`, money: item.tien };
        default:
          return null;
      }
      //
    });
  }

  onOpenSearchApproverDirector() {
    const dialogRef = this.dialog.open(SearchDialogComponent, { data: { keyword: '', componentName: SEARCH_COMPONENT_NAME.APPROVER_DIRECTOR }, disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      this.approveDiscount = result.name;
      this.onChangeApproveDiscount();
    });
  }
  onChangeApproveDiscount() {
    this.handleChangeValue.emit({ t_con_no: this.t_con_no, t_da_tra: this.t_da_tra, t_gg: this.t_gg, nguoi_duyet_ck: this.approveDiscount, t_chi_phi: this.t_cp, status: this.status });
  }

  onClickButton($event: any, id: string) {
    $event.preventDefault();
    const buttonActive = this.buttons.find(x => x.id == id);
    if (buttonActive) {
      const temp = buttonActive.activeColor;
      buttonActive.activeColor = buttonActive.iconColor;
      buttonActive.iconColor = temp;
    }
    this.handleButton.emit(id);
    // this.resetColumnWidth();
  }
  public castIcon(value: string): IconName {
    return value as IconName;
  }
  trackByIndex(index: number, item: any): number {
    return index;
  }
}

