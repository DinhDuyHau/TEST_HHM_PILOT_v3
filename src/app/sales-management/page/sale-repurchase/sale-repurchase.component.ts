import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleRepurchaseService } from './sale-repurchase.service';
import { Merchandise, SaleRepurchaseTicket } from '@app/sales-management/model/ticket/sale-repurchase/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../component/search/serach-dialog.component';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { MerchandiseService } from '../common/merchandise.service';
import { CommonService } from '../common/common.service';
import { MODE, STATUS_LIST } from '@app/sales-management/enum/ticket.enum';
import { CameraComponent } from '@app/sales-management/component/webcam/webcam.component';
import { ViewImageComponent } from '@app/sales-management/component/view-image/view-image.component';
import { Language } from '../common/language';
import { EInvoiceInfo } from '@app/sales-management/model/dto/einvoice.dto';
import { CustomerCreateDialogComponent } from '@app/sales-management/component/customer/customer-create-dialog/customer-create-dialog.component';
import { IMEIService } from '@app/_services/imei.service';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';

const { MERCHANDISE_REPURCHASE_LIST } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-repurchase',
  templateUrl: './sale-repurchase.component.html',
  styleUrls: ['./sale-repurchase.component.scss'],
})
export class SaleRepurchaseComponent implements OnInit, AfterViewInit {
  ticket: SaleRepurchaseTicket = new SaleRepurchaseTicket;
  statusList: StatusTicket[] = [];
  disableSelectStatus = true;
  dataFormat = dataFormat;
  title = '';

  repurchase = {
    ma_kho: '',
    ma_vt: '',
    ten_vt: '',
    loai_hh: '',
    ma_loai: '',
    dvt: '',
  };

  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  merchandiseColumns = MERCHANDISE_REPURCHASE_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  isDisabled = false;
  invalid = false;
  invalidMerchandiseInput = { ma_vt: false, gia_nhap_mua: false, loai_hh: false, ma_kh: false };
  isSaving = false;
  tabIndex = {
    ma_kh: 'ma_kh',
    nvvc: 'nvvc',
    ma_loai: 'ma_loai',
    ma_vt: 'ma_vt',
    gia_nhap_mua: 'gia_nhap_mua',
    imei: 'imei',
  };
  conversionPoints = 0;
  previewImage = '';
  tabIndexFocusFirst = 'imei';
  eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
  entity = TICKET_ENTITY.REPURCHASE;
  action = '';
  shop = '';

  transactionTypeOptions = [
    {
      label: "1-Mua lại từ khách hàng cá nhân",
      value: 1
    },
    {
      label: "2-Mua lại từ khách hàng doanh nghiệp",
      value: 2
    }
  ]

  thuesuatOptions = [
    {
      label: "0",
      value: 0
    },
    {
      label: "5",
      value: 5
    },
    {
      label: "8",
      value: 8
    },
    {
      label: "10",
      value: 10
    }
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleRepurchaseService: SaleRepurchaseService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private imeiService: IMEIService,
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleRepurchaseService.setTicket(this.ticket);
  }

  ngAfterViewInit(): void {
    // this.commonService.focusControl(this.tabIndexFocusFirst);
  }

  ngOnInit() {
    this.route.url.subscribe(urlSegment => {
      const path = urlSegment[0].path;
      if (urlSegment[0].path) {
        switch (path) {
          case 'create':
            this.title = Language.content.add_new;
            this.disableSelectStatus = true;
            this.mode = MODE.CREATE;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
            this.action = 'create';
            break;
          case 'update':
            this.title = Language.content.edit;
            this.mode = MODE.UPDATE;
            this.disableSelectStatus = false;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
            this.action = 'update';
            break;
          case 'view':
            this.title = Language.content.view;
            this.mode = MODE.VIEW;
            this.readonly = true;
            this.cancelButtonTitle = Language.content.exit;
            break;
        }
      }
    });

    const getStatusList = () => {
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.REPURCHASE }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.ticket.masterInfo.fcode1 = '1';
    this.ticket.masterInfo.fqty1 = 0;

    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.REPURCHASE, data.key).subscribe((result) => {
          if (result.result) {
            // set cửa hàng để truyền sang payment tab
            this.shop = (result.result as any).masterInfo.ma_cuahang;

            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.SALE_REPURCHASE.CREATE) {
              this.router.navigate(['/404']);
            }
            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            this.saleRepurchaseService.loadData(result.result as any as VoucherDto);
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
            getStatusList();
            this.commonService.getPointRateExchange(this.ticket);
            this.tabIndexFocusFirst = this.tabIndex.imei;
          }
        });
      } else {
        this.saleRepurchaseService.initTicket(this.ticket);
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket);
        this.tabIndexFocusFirst = this.tabIndex.ma_kh;
      }
    });
  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    this.saleRepurchaseService.setInfoCustomer(customer);
  }

  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleRepurchaseService.resetCustomerInfo(this.ticket);
        this.openAddCustomerDialog(ma_kh);
      }
    });
  }

  openSearchCustomerDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.CUSTOMER })
      .afterClosed()
      .subscribe((customer: Customer) => customer && this.handleAddCustomer(customer));
  }
  // click button thêm khách hàng
  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.saleRepurchaseService.setInfoCustomer(customer);
      });
  }
  // #endregion custome

  // #region imei
  handleAddImei(merchandiseResponse: any) {
    const merchandise = this.merchandiseService.getMerchandiseNotHaveImei(merchandiseResponse.ma_vt, this.ticket.merchandise);
    merchandise && (merchandise.ma_imei = merchandiseResponse.ma_imei) && (merchandise.ma_kho = merchandiseResponse.ma_kho);
    if (!merchandise) {
      this.merchandiseService.addNew(merchandiseResponse, this.ticket.merchandise, Merchandise);
      this.saleRepurchaseService.calcMoney();
      this.commonService.clearText2([this.tabIndex.imei, this.tabIndex.ma_vt]);
    }
  }

  // Kiểm tra iemi đã có trong merchandise chưa
  handleCheckExistsImei(imei: string) {
    const isExists = this.ticket.merchandise.find(item => item.ma_imei.trim() === imei);
    return isExists ? true : false;
  }

  onEnterImeiCode(ma_imei: string) {
    //2024-08-10: bỏ qua check giá nhập (cho phép nhập giá 0đ)
    if (!(/*this.ticket.masterInfo.gia_nhap_mua && */
      this.repurchase.loai_hh && this.ticket.masterInfo.ma_kh)) {
      this.invalidMerchandiseInput.ma_kh = true;
      this.invalidMerchandiseInput.loai_hh = true;
      /*
      this.invalidMerchandiseInput.gia_nhap_mua = true;
      */
      return;
    }
    this.invalidMerchandiseInput.ma_vt = false;
    this.invalidMerchandiseInput.gia_nhap_mua = false;
    this.invalidMerchandiseInput.loai_hh = false;

    const isExists = this.handleCheckExistsImei(ma_imei);
    isExists && this.commonService.showMessageByName('lblWarningInfomationRenew');
    if (!isExists) {
      this.saleRepurchaseService.getImeisStateAndItem([ma_imei]).subscribe((res) => {
        if (res.success && res.result) {
          const imei_info = res.result[0];
          // Kiểm tra: + Nếu tồn tại imei trong hệ thống: TH1: imei chưa bán ra --> imei không hợp lệ, TH2: imei đã bán --> gọi lấy thông tin imei bán ra gần nhất
          //           + Nếu không tồn tại thì phải nhập đầy đủ thông tin yêu cầu
          if (imei_info.exists_yn) {
            if (!imei_info.xuat_yn) {
              this.commonService.showMessageByNameAdvance('xuat_yn_no', { name: '%imei', value: ma_imei });
              return;
            }
            else if (imei_info.dat_hang_yn) {
              this.commonService.showMessageByNameAdvance('dat_hang_yn_yes', { name: '%imei', value: ma_imei });
              return;
            }
            else {
              const merchandise = new Merchandise;
              // nếu loại giao dịch là 2 thì mới lấy thuế suất
              if(this.ticket.masterInfo.fcode1 == "2") {
                merchandise.thue_suat = this.ticket.masterInfo.fqty1;
                merchandise.gia_ban = this.ticket.masterInfo.gia_nhap_mua / (1 + (merchandise.thue_suat / 100));
              } else {
                merchandise.gia_ban = this.ticket.masterInfo.gia_nhap_mua;
              }
              merchandise.s4 = this.ticket.masterInfo.gia_nhap_mua;
              merchandise.thanh_tien = merchandise.gia_ban * merchandise.so_luong;
              merchandise.tt = merchandise.s4 * merchandise.so_luong;
              merchandise.tien_thue = merchandise.tt - merchandise.thanh_tien;
              merchandise.ma_kho = this.repurchase.ma_kho;
              merchandise.ma_loai = this.repurchase.ma_loai;
              merchandise.ten_vt = imei_info.ten_vt;
              merchandise.ma_vt = imei_info.ma_vt;
              merchandise.ma_imei = imei_info.ma_imei;
              merchandise.dvt = imei_info.dvt;
              this.merchandiseService.addNew(merchandise, this.ticket.merchandise, Merchandise);
              this.commonService.clearText2([this.tabIndex.ma_loai, this.tabIndex.ma_vt, this.tabIndex.gia_nhap_mua]);
              this.clearData();
              this.saleRepurchaseService.calcMoney();
              // this.commonService.addImeiToStorage(ma_imei);
            }
          }
          else {
            // 2024-01-22 bổ sung thêm trạng thái đặt hàng khi imei chưa lưu vào hệ thống.
            if (imei_info.dat_hang_yn) {
              this.commonService.showMessageByNameAdvance('dat_hang_yn_yes', { name: '%imei', value: ma_imei });
              return;
            }
            if (!this.repurchase.ma_vt) {
              this.invalidMerchandiseInput.ma_vt = true;
              return;
            }

            // Tính toán các giá trị trước
            const thue_suat = this.ticket.masterInfo.fcode1 == "2" ? this.ticket.masterInfo.fqty1 : 0;
            const gia_ban = this.ticket.masterInfo.fcode1 == "2"
              ? this.ticket.masterInfo.gia_nhap_mua / (1 + (thue_suat / 100))
              : this.ticket.masterInfo.gia_nhap_mua;
            const s4 = this.ticket.masterInfo.gia_nhap_mua;
            const thanh_tien = gia_ban * 1;
            const tt = s4 * 1;
            const tien_thue = tt - thanh_tien;

            const merchandiseResponse = {
              thue_suat: thue_suat,
              gia_ban: gia_ban,
              s4: s4,
              thanh_tien: thanh_tien,
              tt: tt,
              tien_thue: tien_thue,
              ma_vt: this.repurchase.ma_vt,
              ten_vt: this.repurchase.ten_vt,
              ma_loai: this.repurchase.ma_loai,
              dvt: this.repurchase.dvt,
              ma_imei: ma_imei,
              new_imei_yn: true,
              ma_kho: this.repurchase.ma_kho
            };

            this.merchandiseService.addNew(merchandiseResponse, this.ticket.merchandise, Merchandise);
            this.commonService.clearText2([this.tabIndex.ma_loai, this.tabIndex.ma_vt, this.tabIndex.gia_nhap_mua]);
            this.clearData();
            this.saleRepurchaseService.calcMoney();
            // this.commonService.addImeiToStorage(ma_imei);
          }
        }
      });
    }
    this.commonService.clearText2([this.tabIndex.imei]);
    this.commonService.focusControl2(this.tabIndex.imei);
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
  }
  clearData() {
    this.repurchase.ma_vt = '';
    this.repurchase.ten_vt = '';
    this.repurchase.ma_loai = '';
    this.repurchase.loai_hh = '';
    this.repurchase.dvt = '';
    this.repurchase.ma_kho = '';
    this.ticket.masterInfo.gia_nhap_mua = 0;
  }
  // #endregion imei

  // #region merchandise
  openTypeMerchandiseDialog(ma_vt?: string) {
    this.commonService.openDialog(SearchDialogComponent, { keyword: ma_vt || '', componentName: SEARCH_COMPONENT_NAME.TYPE_MERCHANDISE })
      .afterClosed().subscribe(result => {
        this.repurchase.ma_vt = result.ma_vt;
        this.repurchase.ten_vt = result.ten_vt;
        this.repurchase.dvt = result.dvt;
      });
  }

  openSearchTypeMerchandiseDialog() {
    this.commonService.openDialog(SearchDialogComponent, {
      keyword: this.ticket.masterInfo.ma_cuahang,
      componentName: SEARCH_COMPONENT_NAME.REPURCHASE_TYPE_INVENTORY
    })
      .afterClosed().subscribe(result => {
        if (result) {
          this.repurchase.loai_hh = result.ten_loai;
          this.repurchase.ma_loai = result.ma_loai;
          this.ticketApiService.getStocks(TICKET_ENTITY.REPURCHASE, {
            ma_cuahang: this.ticket.masterInfo.ma_cuahang,
            ma_loai: result.ma_loai
          }).subscribe(result => {
            if (result.success) {
              const { ma_kho } = result.result as any;
              this.repurchase.ma_kho = ma_kho || '';
            }
          });
        }
      });
  }

  // Nhập giá mua
  onEnterPrice(gia_nhap_mua: number) {
    this.ticket.masterInfo.gia_nhap_mua = gia_nhap_mua;
  }

  onRemoveMerchandise(event: { item: Merchandise }) {
    this.handleRemoveMerchandise(event.item);
  }

  handleRemoveMerchandise(merchandise: Merchandise) {
    this.saleRepurchaseService.removeMerchandise(merchandise);
  }

  // #endregion merchandise

  //Upload image
  openUploadImage() {
    this.commonService.openDialog(CameraComponent, {}, 'camera-style').afterClosed().subscribe(result => {
      this.previewImage = result;
    });
  }

  // Open Image
  openImage() {
    if (!this.previewImage) {
      this.commonService.showMessage(Language.content.No_image);
      return;
    }
    this.commonService.openDialog(ViewImageComponent, { imageUrl: this.previewImage }, '', false).afterClosed().subscribe(result => {
      //
    });
  }

  // Submit
  onSave() {
    // Check âm tiền nợ
    if (this.ticket.masterInfo.t_con_no < 0) {
      this.commonService.showMessage('Tiền nợ không được âm');
      return;
    }

    // check mã kho rỗng
    const allHasMaKho = this.ticket.merchandise.every(item => item.ma_kho);
    if (!allHasMaKho) {
      this.commonService.showMessage('Mã kho không được để trống')
      return;
    }

    //Check imei trùng trong grid chi tiết
    const mechandise_dup = [];
    const counter: { [key: string]: number } = {};
    for (const item of this.ticket.merchandise) {
      counter[item.ma_imei] = (counter[item.ma_imei] || 0) + 1;
      if (counter[item.ma_imei] > 1) {
        mechandise_dup.push(item.ma_imei);
      }
    }
    if (mechandise_dup && mechandise_dup.length > 0) {
      const duplicate_imeis = mechandise_dup.join(',');
      this.commonService.showMessage(`Các imei xuất hiện nhiều lần trong chi tiết phiếu: ${duplicate_imeis}`);
      return;
    }

    const message = this.saleRepurchaseService.validateTicket(this.ticket);
    this.invalid = this.saleRepurchaseService.isInvalidForm(this.ticket.masterInfo);
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.saleRepurchaseService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        this.isDisabled = true;
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.REPURCHASE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Update_Completed);
              this.router.navigate(['sales/repurchase']);
            } else {
              if (result.result && result.result.length > 0) {
                this.commonService.showMessageByNameAdvance(result.message, ...result.result);
              }
              else {
                this.commonService.showMessageByName(result.message);
              }
            }
          });
        } else if (this.mode === MODE.CREATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.REPURCHASE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Successful_Create);
              this.router.navigate(['sales/repurchase']);
            } else {
              if (result.result && result.result.length > 0) {
                this.commonService.showMessageByNameAdvance(result.message, ...result.result);
              }
              else {
                this.commonService.showMessageByName(result.message);
              }
            }
          });
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['sales/repurchase']);
    // const imeis = this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei);
    // if (imeis.length > 0) {
    //   this.imeiApiService.updateImeiState(imeis, false).subscribe(result => {
    //     if (result.success) {
    //       this.router.navigate(['sales/repurchase']);
    //     } else {
    //       this.commonService.showMessage('Lỗi update state của hàng hóa');
    //     }
    //   });
    // } else {
    //   this.router.navigate(['sales/repurchase']);
    // }

  }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  onChangeTransactionType(event: any) {
    this.ticket.masterInfo.fcode1 = event
    // set lại mặc định là 10
    if (event === "1") {
      this.ticket.masterInfo.fqty1 = 0;
    }
    if (event === "2") {
      this.ticket.masterInfo.fqty1 = 10;
    }
  }

  onChangeThueSuat(event: any) {
    this.ticket.masterInfo.fqty1 = event
  }

  handleChangeTaxCode(event: string) {
    this.commonService.getCustomerInfoByTax(event).subscribe((result: any) => {
      if (result.success) {
        this.ticket.masterInfo.hd_dia_chi = result.result.dia_chi;
        this.ticket.masterInfo.hd_ten_kh = result.result.ten_kh;
      }
      else {
        this.commonService.showMessageByName(result.message);
      }
    });
  }
}


