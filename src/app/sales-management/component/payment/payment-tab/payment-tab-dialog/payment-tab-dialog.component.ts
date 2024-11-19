import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import dataFormat from '@app/_common/dataFormat';
import { DepositDetail, DiscountCode, Payment, PaymentRequest, TransferDetail } from '@app/sales-management/model/ticket/common-model/payment.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../../search/serach-dialog.component';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { DepositSelectComponent } from '../../../deposit/deposit-select.component';
import { POSModel } from '@app/sales-management/model/dto/pos.dto';
import { POSService } from '@app/sales-management/api/pos-api.service';
import { Language } from '@app/sales-management/page/common/language';
import { DiscountProgramService } from '@app/_components/lookup/discount_program/discount_program.service';
import { ViewDiscountProgramService } from '@app/_components/lookup/view_discount_program/view_discount_program.service';
import { SwipeCardComponent } from '../../swipe-card/swipe-card.component';
import { EWalletComponent } from '../../e-wallet/e-wallet.component';
import { TransferComponent } from '../../transfer/transfer.component';
import { VNPayComponent } from '../../vnpay/vnpay.component';
import { TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { PaymentApiService } from '@app/sales-management/api/payment-api.service';
import { formatDate } from '@angular/common';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-payment-tab-dialog',
  templateUrl: './payment-tab-dialog.component.html',
  styleUrls: ['./payment-tab-dialog.component.scss']
})
export class PaymentTabDialogComponent implements OnChanges, OnInit, AfterViewInit {
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
  @Input() merchandise: any[] = [];
  @Input() isPaymentHH = false;
  @Input() approveDiscount = '';

  @Output() handleChangeValue = new EventEmitter<{ t_con_no: number; t_da_tra: number; t_gg: number; nguoi_duyet_ck: string }>();

  otp = '';
  t_tien_phi = 0;
  tong_no = 0;
  ma_gg = '';
  dataFormat = dataFormat;
  depositSelected = [];
  invalid = {
    quet_the_tra_gop: {
      ma_may_pos: false,
      ma_dv_tragop: false
    },
    tra_gop: {
      ma_dv_tragop: false
    },
    voucher_doi_tac: {
      ma_ctr: false
    }
  };

  ma_kh = '';
  ngay_ct = '';
  reloadDepositOnInit = false;
  shop: string = '';

  constructor(
    public dialogRef: MatDialogRef<PaymentTabDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataPayment: {
      data: Payment,
      t_tong_tien: number,
      t_con_no: number,
      t_da_tra: number,
      t_gg: number,
      t_dat_coc_max: number,
      he_so_qd: number,
      diem_qd_max: number,
      depositSource: any[],
      pay_hidden: any,
      readonly: boolean,
      merchandise: any[],
      isPaymentHH: boolean,
      approveDiscount: string,
      ma_kh: string,
      ngay_ct: string,
      reloadDepositOnInit: boolean,
      action: string,
      shop: string
    },
    private dialog: MatDialog,
    private commonService: CommonService,
    private posService: POSService,
    private discountProgramService: DiscountProgramService,
    private viewDiscountProgramService: ViewDiscountProgramService,
    private paymentApiService: PaymentApiService,
    private customerApiService: CustomerApiService,
    private authenticateService: AuthenticationService
  ) {
    this.data = dataPayment.data;
    this.t_tong_tien = dataPayment.t_tong_tien;
    this.t_con_no = dataPayment.t_con_no;
    this.t_da_tra = dataPayment.t_da_tra;
    this.t_gg = dataPayment.t_gg;
    this.t_dat_coc_max = dataPayment.t_dat_coc_max;
    this.he_so_qd = dataPayment.he_so_qd;
    this.diem_qd_max = dataPayment.diem_qd_max;
    this.depositSource = dataPayment.depositSource;
    this.pay_hidden = dataPayment.pay_hidden;
    this.readonly = dataPayment.readonly;
    this.merchandise = dataPayment.merchandise;
    this.isPaymentHH = dataPayment.isPaymentHH;
    this.approveDiscount = dataPayment.approveDiscount;

    this.ma_kh = dataPayment.ma_kh;
    this.ngay_ct = dataPayment.ngay_ct;
    this.reloadDepositOnInit = dataPayment.reloadDepositOnInit;

    if (this.isPaymentHH) {
      if (!this.data.chuyen_khoan.selected) {
        this.data.chuyen_khoan.detail.push(new TransferDetail);
      }
      else {
        const detail = this.data.chuyen_khoan.detail.find(x => x.tien && x.tien != 0);
        if (detail) {
          this.data.chuyen_khoan.detail = [detail];
        }
        else {
          this.data.chuyen_khoan.detail = [new TransferDetail];
        }
      }
    }
    this.tong_no = this.t_tong_tien;
    this.onChange();

    // xử lý param shop theo action
    if (this.dataPayment.action === 'create') {
      this.shop = this.authenticateService.userValue?.shop ?? '';
    }
    if (this.dataPayment.action === 'update') {
      this.shop = this.dataPayment.shop ?? this.authenticateService.userValue?.shop;
    }
  }

  ngOnInit(): void {
    // console.log(this.data);

    //load lại thông tin tiền đặt cọc, tạm ứng của khách hàng
    if (this.reloadDepositOnInit) {
      this.handleGetDeposit();
    }
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  handleGetDeposit() {
    //lấy thông tin đvcs từ user đăng nhập
    const user: any = JSON.parse(localStorage.getItem('user')!);
    let ma_dvcs = '';
    if (user) {
      ma_dvcs = user.unit;
    }
    const ngay_ct = formatDate(this.ngay_ct, 'yyyy/MM/dd', 'en_US');

    if (!this.ma_kh || this.ma_kh === '' || ma_dvcs === '' || ngay_ct === '')
      return;

    const getDeposit = () => {
      return this.customerApiService.getDeposit(this.ma_kh, ma_dvcs, ngay_ct);
    };
    getDeposit().subscribe((result: any) => {
      if (result && result.success && result.result) {
        this.depositSource = result.result.items;
        this.t_dat_coc_max = this.depositSource.reduce((pre: number, cur: any) => pre + cur.cl_nt, 0);
      }
    })
  }

  onChange() {
    let tien_con_no = 0;
    this.t_gg = 0;
    this.t_tien_phi = 0;

    //reset
    if (!this.data.tien_mat.selected) this.data.tien_mat.tien = 0;
    if (!this.data.tien_dat_coc.selected) this.data.tien_dat_coc.tien = 0;
    if (!this.data.chuyen_khoan.selected) this.data.chuyen_khoan.tien = 0;
    if (!this.data.quet_the.selected) this.data.quet_the.tien = 0;
    if (!this.data.vnpay.selected) this.data.vnpay.tien = 0;
    if (!this.data.vi_dien_tu.selected) this.data.vi_dien_tu.tien = 0;
    if (!this.data.tra_gop.selected) this.data.tra_gop.tien = 0;
    if (!this.data.sd_diem.selected) this.data.sd_diem.tien = 0;
    if (!this.data.ma_giam_gia.selected) this.data.ma_giam_gia.tien = 0;
    if (!this.data.giam_gia_crm.selected) this.data.giam_gia_crm.tien = 0;
    if (!this.data.quet_the_tra_gop.selected) this.data.quet_the_tra_gop.tien = 0;
    if (!this.data.voucher_doi_tac.selected) this.data.voucher_doi_tac.tien = 0;

    if (this.data.sd_diem.diem_qd >= 0 && this.he_so_qd) {
      this.data.sd_diem.tien = this.commonService.calcExchangeMoney(this.data.sd_diem.diem_qd, this.he_so_qd);
    }
    if (this.tong_no >= 0) {
      tien_con_no = this.t_con_no > 0 ? this.t_con_no : 0;
      this.t_con_no = this.tong_no;

      //Tiền đặt cọc
      if (this.data.tien_dat_coc.selected && this.data.tien_dat_coc.tien) {
        console.log(this.data.tien_dat_coc);
        console.log(this.t_dat_coc_max);
        this.data.tien_dat_coc.tien <= this.t_dat_coc_max ?
          this.t_con_no -= this.data.tien_dat_coc.tien :
          this.t_con_no -= this.t_dat_coc_max;
      }

      //Tiền mặt
      if (this.data.tien_mat.selected && this.data.tien_mat.tien === 0) {
        this.data.tien_mat.tien = tien_con_no;
      }
      if (this.data.tien_mat.selected && this.data.tien_mat.tien) {
        this.t_con_no -= this.data.tien_mat.tien;
      }

      //Chuyển khoản
      if (this.data.chuyen_khoan.selected && this.data.chuyen_khoan.tien) {
        this.t_con_no -= this.data.chuyen_khoan.tien;
      }

      //Quẹt thẻ
      if (this.data.quet_the.selected && this.data.quet_the.tien) {
        this.t_con_no -= this.data.quet_the.tien;
      }

      //Quẹt thẻ trả góp
      if (this.data.quet_the_tra_gop.selected && this.data.quet_the_tra_gop.tien) {
        this.t_con_no -= this.data.quet_the_tra_gop.tien;
      }

      //VNPay
      if (this.data.vnpay.selected && this.data.vnpay.tien === 0) {
        // this.data.vnpay.tien = tien_con_no;
      }
      if (this.data.vnpay.selected && this.data.vnpay.tien) {
        this.t_con_no -= this.data.vnpay.tien;
      }

      //Ví điện tử
      if (this.data.vi_dien_tu.selected && this.data.vi_dien_tu.tien) {
        this.t_con_no -= this.data.vi_dien_tu.tien;
      }

      //Trả góp
      if (this.data.tra_gop.selected && this.data.tra_gop.tien === 0) {
        this.data.tra_gop.tien = tien_con_no;
      }
      if (this.data.tra_gop.selected && this.data.tra_gop.tien) {
        this.t_con_no -= this.data.tra_gop.tien;
      }

      //Sử dụng điểm
      if (this.data.sd_diem.selected && this.data.sd_diem.tien) {
        this.t_con_no -= this.data.sd_diem.tien;
      }

      //Mã giảm giá HH
      if (this.data.ma_giam_gia.ma_gg && this.data.ma_giam_gia.tien) {
        this.t_con_no -= this.data.ma_giam_gia.tien;
        this.t_gg += this.data.ma_giam_gia.tien;
      }

      //Giảm giá chương trình CRM
      if (this.data.giam_gia_crm.selected && this.data.giam_gia_crm.tien) {
        this.t_con_no -= this.data.giam_gia_crm.tien;
        this.t_gg += this.data.giam_gia_crm.tien;
      }

      //Voucher đối tác
      if (this.data.voucher_doi_tac.selected && this.data.voucher_doi_tac.tien) {
        this.t_con_no -= this.data.voucher_doi_tac.tien;
      }

      //Tổng tiền phí
      this.t_tien_phi += (this.data.quet_the_tra_gop.selected && this.data.quet_the_tra_gop.phi_chuyendoi) ?
        this.data.quet_the_tra_gop.phi_chuyendoi : 0;
      this.t_tien_phi += (this.data.tra_gop.selected && this.data.tra_gop.phi_cd_tragop) ? this.data.tra_gop.phi_cd_tragop : 0;

      this.t_da_tra = this.tong_no - this.t_con_no;

      //Cộng tổng tiền phí vào số tiền còn nợ
      this.t_con_no += this.t_tien_phi;
    }
    this.handleChangeValue.emit({ t_con_no: this.t_con_no, t_da_tra: this.t_da_tra, t_gg: this.t_gg, nguoi_duyet_ck: this.approveDiscount });
  }

  onChangeValue() {
    this.handleChangeValue.emit({ t_con_no: this.t_con_no, t_da_tra: this.t_da_tra, t_gg: this.t_gg, nguoi_duyet_ck: this.approveDiscount });
  }

  onChangeApproveDiscount() {
    this.handleChangeValue.emit({ t_con_no: this.t_con_no, t_da_tra: this.t_da_tra, t_gg: this.t_gg, nguoi_duyet_ck: this.approveDiscount });
  }

  // onOpenSearchBankAccount() {
  //   const dialogRef = this.dialog.open(SearchDialogComponent, { data: { keyword: '', componentName: SEARCH_COMPONENT_NAME.BANK_ACCOUNT }, disableClose: true });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.data.chuyen_khoan.detail[0].tk_nh_nhan = result.tknh;
  //     this.data.chuyen_khoan.detail[0].ten_ngan_hang = result.ten_nh;
  //     this.onChange();
  //   });
  // }

  onOpenSearchBankAccount() {
    const dialogRef = this.commonService.openDialog(SearchDialogComponent, { keyword: "CHUYENKHOAN", componentName: SEARCH_COMPONENT_NAME.BANK_ACCOUNT, title: 'Danh sách ngân hàng' }, 'search-style-dialog');
    dialogRef.afterClosed().subscribe(result => {
      this.data.quet_the_tra_gop.tk_nh_nhan = result.tknh;
    });
  }

  onOpenSearchBankPublishCard() {
    const dialogRef = this.commonService.openDialog(SearchDialogComponent, { keyword: "", componentName: SEARCH_COMPONENT_NAME.BANK_PUBLISH_CARD, title: 'Danh sách ngân hàng' }, 'search-style-dialog');
    dialogRef.afterClosed().subscribe(result => {
      this.data.quet_the_tra_gop.tk_nh_nhan = result.ma_nh;
    });
  }

  onOpenSearchInstallmentUnit() {
    const dialogRef = this.dialog.open(SearchDialogComponent, { data: { keyword: '', componentName: SEARCH_COMPONENT_NAME.INSTALLMENT_UNIT }, disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      this.data.tra_gop.ma_dv_tragop = result.ma_kh;
      this.onChange();
    });
  }

  onOpenSearchCardInstallmentUnit() {
    const dialogRef = this.dialog.open(SearchDialogComponent, { data: { keyword: '', componentName: SEARCH_COMPONENT_NAME.INSTALLMENT_UNIT }, disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      this.data.quet_the_tra_gop.ma_dv_tragop = result.ma_kh;
      this.onChange();
    });
  }

  onOpenSearchVoucherParner() {
    const dialogRef = this.dialog.open(SearchDialogComponent, { data: { keyword: '', componentName: SEARCH_COMPONENT_NAME.INSTALLMENT_UNIT }, disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      this.data.voucher_doi_tac.ma_ctr = result.ma_kh;
      this.onChange();
    });
  }

  onOpenSearchApproverDirector() {
    const dialogRef = this.dialog.open(SearchDialogComponent, { data: { keyword: '', componentName: SEARCH_COMPONENT_NAME.APPROVER_DIRECTOR }, disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      this.approveDiscount = result.name;
      this.onChangeApproveDiscount();
    });
  }
  // onOpenSearchWallet() {
  //   const dialogRef = this.dialog.open(SearchDialogComponent, { data: { keyword: '', componentName: SEARCH_COMPONENT_NAME.WALLET }, disableClose: true });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.data.vi_dien_tu.thong_tin = result.ma_kh;
  //     this.onChange();
  //   });
  // }
  openDepositDialog() {
    //lọc lấy tiền cọc của các vật tư có trong grid hàng hóa
    const deposit = this.depositSource.filter(x => x.ma_vt.trim() === '' ||
      this.merchandise.some((item: any) => item.ma_vt.trim() === x.ma_vt.trim())
    );

    if (deposit.length > 0) {
      this.commonService.openDialog(DepositSelectComponent, { dataSource: deposit, currentItem: this.depositSelected })
        .afterClosed().subscribe(depositSelected => {
          this.depositSelected = depositSelected || [];
          if (depositSelected && depositSelected.length) {
            const tien_tt_coc = depositSelected.reduce((pre: number, cur: any) => pre + cur.cl_nt, 0);
            this.data.tien_dat_coc.tien = this.t_con_no > tien_tt_coc ? tien_tt_coc : this.t_con_no;
            this.data.tien_dat_coc.selected = this.data.tien_dat_coc.tien > 0;
            this.data.tien_dat_coc.detail = depositSelected.map((item: any) => {
              const payment = new DepositDetail;
              // payment.tien = item.cl_nt;
              payment.tien = this.data.tien_dat_coc.tien;
              payment.stt_rec_pt = item.stt_rec;
              payment.ma_sp = item.ma_vt;
              payment.ma_ctr = item.ma_ctr;
              return payment;
            });

          } else if (depositSelected && depositSelected.length === 0) {
            this.depositSelected = [];
            this.data.tien_dat_coc.selected = false;
            this.data.tien_dat_coc.tien = 0;
          }
          this.onChange();
        });
    }
    else {
      this.commonService.showMessageByContent('Không có tiền cọc');
      return;
    }
  }
  // handleAddPOS(pos: POSModel) {
  //   this.data.quet_the.ma_may_pos = pos.ma_pos;
  // }

  // openSearchPOSDialog() {
  //   this.commonService.openDialog(SearchDialogComponent,
  //     { keyword: '', componentName: SEARCH_COMPONENT_NAME.POS, title: 'Danh sách máy POS' }, 'search-style-dialog')
  //     .afterClosed()
  //     .subscribe((pos: POSModel) => pos && this.handleAddPOS(pos));
  // }
  // onEnterPOSCode(ma_pos: string) {
  //   this.posService.getOneById(ma_pos).subscribe(result => {
  //     if (result.success && result.result) {
  //       const pos: any = result.result;
  //       this.handleAddPOS(pos);
  //     } else {
  //       this.commonService.showMessageByContent(Language.content.exists_pos_yn_no, ma_pos);
  //       this.data.quet_the.ma_may_pos = '';
  //     }
  //   });
  // }
  onClickGetDiscountCode() {
    // Lấy danh sách các mã vật tư
    // const list_vt = [...new Set(this.merchandise.filter(x => !x.km_yn).map((x: any) => x.ma_vt.trim()))];
    // if (list_vt.length == 0) {
    //   this.commonService.showMessageByContent('Bạn cần nhập thông tin hàng hóa trước');
    //   return;
    // }
    if (this.ma_gg == '') {
      this.commonService.showMessageByContent('Bạn cần nhập thông tin mã giảm giá');
      return;
    }
    this.commonService.getDiscountCodeInfo(this.ma_gg).subscribe((result: any) => {
      if (result.success && result.result) {
        this.ma_gg = '';
        const tien_gg = Number(result.result.tien_gg_nt) > this.t_con_no ? this.t_con_no : Number(result.result.tien_gg_nt);
        this.data.ma_giam_gia = { ...this.data.ma_giam_gia, ma_gg: result.result.ma_gg, tien: tien_gg };
        this.onChange();
      } else {
        this.commonService.showMessageByName('discount_code_invalid');
      }
    });
    //
  }
  onClickCancelDiscountCode() {
    this.data.ma_giam_gia = new DiscountCode;
    this.t_gg = 0;
    this.onChange();
  }

  onClickGetDiscountProgramCRM() {
    // Lấy danh sách các mã vật tư
    const list_vt = this.merchandise.filter(x => !x.km_yn);
    if (list_vt.length == 0) {
      this.commonService.showMessageByContent('Bạn cần nhập thông tin hàng hóa trước');
      return;
    }
    // if (this.ma_gg == '') {
    //   this.commonService.showMessageByContent('Bạn cần nhập thông tin mã giảm giá');
    //   return;
    // }
    this.discountProgramService.setListItem(list_vt, this.data.giam_gia_crm.detail);
    this.commonService.openLookup(this.discountProgramService, true).subscribe((res: any[]) => {
      if (res) {
        this.data.giam_gia_crm.detail = res.map((item) => {
          return {
            ma_gg: item.ma_gg,
            ma_ctr: item.ma_ctr,
            ma_imei: item.ma_imei,
            ma_vt: item.ma_vt,
            tien_giam: item.tien_giam,
            ten_ctr: item.ten_ctr,
            ten_vt: item.ten_vt,
          };
        });
        this.data.giam_gia_crm.tien = this.data.giam_gia_crm.detail.reduce((res, cur) => { return res + cur.tien_giam; }, 0);
        this.onChange();
      }
    });
    //
  }
  onClickViewDiscountProgramCRM() {
    if (this.data.giam_gia_crm.detail.length == 0) {
      this.commonService.showMessageByContent('Chưa có thông tin mã giảm giá của hãng');
      return;
    }
    this.viewDiscountProgramService.setListItem(this.data.giam_gia_crm.detail);
    this.commonService.openLookup(this.viewDiscountProgramService);
  }
  onClickCancelDiscountProgramCRM(index: number) {
    this.data.giam_gia_crm.detail.splice(index, 1);
    this.data.giam_gia_crm.tien = this.data.giam_gia_crm.detail.reduce((res, cur) => { return res + cur.tien_giam; }, 0);
    this.onChange();
  }

  openSwipeCardDialog() {
    this.commonService.openDialog(SwipeCardComponent,
      { card: this.data.quet_the, disabled: this.readonly, shop: this.shop }, 'search-style-dialog')
      .afterClosed()
      .subscribe(() => {
        this.onChange();
        // pos && this.handleAddPOS(pos)
      });
  }
  openTransferCardDialog() {
    this.commonService.openDialog(TransferComponent,
      { transfer: this.data.chuyen_khoan, disabled: this.readonly, tien_con_no: this.t_con_no }, 'search-style-dialog')
      .afterClosed()
      .subscribe(() => {
        this.onChange();
        // pos && this.handleAddPOS(pos)
      });
  }
  openEWalletDialog() {
    this.commonService.openDialog(EWalletComponent,
      { eWallet: this.data.vi_dien_tu, disabled: this.readonly }, 'search-style-dialog')
      .afterClosed()
      .subscribe(() => {
        this.onChange();
        // pos && this.handleAddPOS(pos)
      });
  }

  openVNPayDialog() {
    this.commonService.openDialog(VNPayComponent,
      { vnpay: this.data.vnpay, disabled: this.readonly }, 'search-style-dialog')
      .afterClosed()
      .subscribe(() => {
        this.onChange();
        // pos && this.handleAddPOS(pos)
      });
  }

  openPaymentSearchPOSDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { shop: this.shop, keyword: '', componentName: SEARCH_COMPONENT_NAME.POS, title: 'Danh sách máy POS' }, 'search-style-dialog')
      .afterClosed()
      .subscribe((pos: POSModel) => pos && this.handleAddPOS(pos));
  }

  onPaymentEnterPOSCode(ma_pos: string) {
    this.posService.getOneById(ma_pos).subscribe(result => {
      if (result.success && result.result) {
        const pos: any = result.result;
        this.handleAddPOS(pos);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_pos_yn_no, ma_pos);
        this.data.quet_the_tra_gop.ma_may_pos = '';
      }
    });
  }

  onSendOtp() {
    this.paymentApiService.sendOtp(
      this.dataPayment.ma_kh,
      formatDate(this.dataPayment.ngay_ct, 'yyyy/MM/dd', 'en_US'),
      this.data.sd_diem.diem_qd)
      .subscribe(result => {
        if (result.success) {
          this.commonService.showMessage("Gửi otp thành công")
        } else {
          this.commonService.showMessage("Gửi otp không thành công")
        }
      })
  }

  onVerifyOtp() {
    this.paymentApiService.verifyOtp(
      this.dataPayment.ma_kh,
      this.otp)
      .subscribe(result => {
        if (result.success) {
          this.data.sd_diem.tien = result?.result?.so_tien;
          this.data.sd_diem.diem_qd = result?.result?.so_diem;
          this.commonService.showMessage("Mã otp hợp lệ")
        }
        else {
          this.commonService.showMessage("Mã otp không hợp lệ")
        }
      })
  }

  handleAddPOS(pos: POSModel) {
    this.data.quet_the_tra_gop.ma_may_pos = pos.ma_pos;
  }

  validateFail() {
    if (this.data.quet_the_tra_gop.selected && !this.data.quet_the_tra_gop.ma_may_pos.trim() && !this.data.quet_the_tra_gop.ma_dv_tragop.trim()) {
      this.invalid.quet_the_tra_gop.ma_may_pos = true;
      this.invalid.quet_the_tra_gop.ma_dv_tragop = true;
      return true;
    }
    if (this.data.tra_gop.selected && !this.data.tra_gop.ma_dv_tragop.trim()) {
      this.invalid.tra_gop.ma_dv_tragop = true;
      return true;
    }
    if (this.data.voucher_doi_tac.selected && !this.data.voucher_doi_tac.ma_ctr.trim()) {
      this.invalid.voucher_doi_tac.ma_ctr = true;
      return true;
    }
    if (this.t_con_no < 0) {
      this.commonService.showMessage("Tiền còn nợ không được là số âm");
      return true;
    }
    return false;
  }

  onCancel() {
    if (this.validateFail()) {
      return;
    } else {
      this.dialogRef.close({ t_con_no: this.t_con_no, t_da_tra: this.t_da_tra, t_gg: this.t_gg, nguoi_duyet_ck: this.approveDiscount, t_chi_phi: this.t_tien_phi });
    }
  }


}

