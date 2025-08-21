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
import { checkValidImei } from '@app/_common/commonFunction';
import { formatDate } from '@angular/common';

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
  isValidItemOld = false;
  invoice_model_status = '0';

  transactionTypeOptions = [
    {
      label: "1-Mua lại từ khách hàng cá nhân",
      value: 1
    },
    {
      label: "2-Mua lại từ khách hàng doanh nghiệp",
      value: 2
    },
    {
      label: "3-Mua thu cũ không lên đời",
      value: 3
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

  renew = {
    ma_imei: '',
    ma_kho: '',
    ma_vt: '',
    ten_vt: '',
    loai_hh: '',
    gia_nt: 0,
    gia_mua: 0,
    ma_loai: '',
    dvt: '',
    new_imei_yn: false,
    ma_ncc: '', // đại lý thu mua
    ma_cttc: '',
    ten_cttc: '',
  };

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
    // check quyền truy cập
    this.commonService.processAuthorization();

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

            //set status để xử lý vấn đề in ngay trên màn hình xem chứng từ
            this.invoice_model_status = (result.result as any).masterInfo.status;

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

            // xử lý ẩn hiện cột mong muốn
            if (this.ticket.masterInfo.fcode1 === "3") {
              const updatesColumns = [
                { name: 'sl_td1', field: 'visible', value: true },
                { name: 'ma_td1', field: 'visible', value: true },
                { name: 'ma_td2', field: 'visible', value: true },
                { name: 'ma_td3', field: 'visible', value: true },
              ];
              this.merchandiseColumns = this.commonService.updateColumnsFields(this.merchandiseColumns, updatesColumns);
            }
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

    // thêm kiểm tra imei hợp lệ
    if (!checkValidImei(ma_imei)) {
      this.commonService.showMessageByName('lblWarningImeiInputInvalid');
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
            else if (imei_info.bao_hanh_yn) {
              this.commonService.showMessage('Imei đang trong trạng thái xuất bảo hành');
              return;
            }
            else {
              const merchandise = new Merchandise;
              // nếu loại giao dịch là 2 thì mới lấy thuế suất
              if (this.ticket.masterInfo.fcode1 == "2") {
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
              this.commonService.clearText2([this.tabIndex.imei]);
              this.commonService.focusControl2(this.tabIndex.imei);
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
              this.commonService.showMessage('Imei không tồn tại trong hệ thống, vui lòng chọn mã hàng');
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
            this.commonService.clearText2([this.tabIndex.imei]);
            this.commonService.focusControl2(this.tabIndex.imei);
            this.saleRepurchaseService.calcMoney();
            // this.commonService.addImeiToStorage(ma_imei);
          }
        }
      });
    }
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

        // loai gd 3: mua thu cũ không lên đời
        this.renew.ma_vt = result.ma_vt;
        this.renew.ten_vt = result.ten_vt;
        this.renew.dvt = result.dvt;

        //get imei from input field
        const imeiElement = document.getElementById(`${this.tabIndex.imei}`);
        if (imeiElement) {
          const imei = (imeiElement as HTMLInputElement).value;
          this.onEnterImeiCode(imei);
        }
      });
  }

  openSearchTypeMerchandiseDialog() {
    this.commonService.openDialog(SearchDialogComponent, {
      // componentName: SEARCH_COMPONENT_NAME.REPURCHASE_TYPE_INVENTORY
      componentName: SEARCH_COMPONENT_NAME.REPURCHASE_GROUP_INVENTORY
    })
      .afterClosed().subscribe(result => {
        if (result) {
          this.repurchase.loai_hh = result.ten_nh;
          this.repurchase.ma_loai = result.ma_nh;
          this.ticketApiService.getStocks2(TICKET_ENTITY.REPURCHASE, {
            ma_cuahang: this.ticket.masterInfo.ma_cuahang,
            ma_nh: result.ma_nh
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
              this.commonService.handleResponseErrorVoucher(result, 'sales/repurchase');
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
              this.commonService.handleResponseErrorVoucher(result, 'sales/repurchase');
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
      const updatesColumns = [
        { name: 'sl_td1', field: 'visible', value: false },
        { name: 'ma_td1', field: 'visible', value: false },
        { name: 'ma_td2', field: 'visible', value: false },
        { name: 'ma_td3', field: 'visible', value: false },
      ];
      this.merchandiseColumns = this.commonService.updateColumnsFields(this.merchandiseColumns, updatesColumns);

      this.ticket.masterInfo.fqty1 = 0;
      // reset
      this.resetDataItem();
    }
    if (event === "2") {
      const updatesColumns = [
        { name: 'sl_td1', field: 'visible', value: false },
        { name: 'ma_td1', field: 'visible', value: false },
        { name: 'ma_td2', field: 'visible', value: false },
        { name: 'ma_td3', field: 'visible', value: false },
      ];
      this.merchandiseColumns = this.commonService.updateColumnsFields(this.merchandiseColumns, updatesColumns);

      this.ticket.masterInfo.fqty1 = 10;
      // reset
      this.resetDataItem();
    }
    if (event === "3") {
      const updatesColumns = [
        { name: 'sl_td1', field: 'visible', value: true },
        { name: 'ma_td1', field: 'visible', value: true },
        { name: 'ma_td2', field: 'visible', value: true },
        { name: 'ma_td3', field: 'visible', value: true },
      ];
      this.merchandiseColumns = this.commonService.updateColumnsFields(this.merchandiseColumns, updatesColumns);

      // this.repurchase.loai_hh = "Hàng cũ";
      // this.repurchase.ma_loai = "HC";
      // this.ticketApiService.getStocks2(TICKET_ENTITY.REPURCHASE, {
      //   ma_cuahang: this.ticket.masterInfo.ma_cuahang,
      //   ma_nh: "HC"
      // }).subscribe(result => {
      //   if (result.success) {
      //     const { ma_kho } = result.result as any;
      //     this.repurchase.ma_kho = ma_kho || '';
      //   }
      // });
    }
  }

  onChangeThueSuat(event: any) {
    this.ticket.masterInfo.fqty1 = Number(event)
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

  onEnterMerchandiseCode(event: any) {
    const ma_vt = event;

    this.saleRepurchaseService.getMerchandiseInfo(ma_vt).subscribe(result => {
      if (result.success && result.result) {
        const merchandise = result.result as any;
        this.repurchase.ma_vt = merchandise.ma_vt;
        this.repurchase.ten_vt = merchandise.ten_vt;
        this.repurchase.dvt = merchandise.dvt;

        //get imei from input field
        const imeiElement = document.getElementById(`${this.tabIndex.imei}`);
        if (imeiElement) {
          const imei = (imeiElement as HTMLInputElement).value;
          this.onEnterImeiCode(imei);
        }
      }
      else {
        this.openTypeMerchandiseDialog();
      }
    });
  }

  resetDataItem() {
    this.repurchase.ma_vt = '';
    this.repurchase.ten_vt = '';
    this.repurchase.dvt = '';

    this.renew.ma_imei = '';
    this.renew.ma_vt = '';
    this.renew.ten_vt = '';
    this.renew.dvt = '';
    this.renew.ma_ncc = '';
    this.renew.ma_cttc = '';
    this.renew.ten_cttc = '';

    this.repurchase.loai_hh = '';
    this.repurchase.ma_loai = '';
    this.repurchase.ma_kho = '';
  }

  // #region 3.mua thu cũ không lên đời
  onChangeImei($event: any) {
    if (this.ticket.masterInfo.ten_kh == '') {
      this.commonService.showMessage('Mã khách hàng không được để trống');
      return;
    }
    this.renew.ma_imei = $event;
    this.imeiApiService.getImeisStateAndItem([$event]).subscribe((result) => {
      if (result && result.success && result.result && result.result[0]) {
        if (result.result[0].bao_hanh_yn) {
          this.commonService.showMessage('Imei đang trong trạng thái xuất bảo hành');
          return;
        }
        const map = new Map();
        map.set('in_store_yn', false);
        map.set('dat_hang_yn', false);
        const message = this.imeiService.GetMessageStatusImei(map, result.result[0]);
        if (message) {
          this.renew.ma_imei = '';
          this.commonService.showMessageByContent(this.imeiService.GetMessageStatusImei(map, result.result[0]));
          return;
        }
        if (result.result[0].exists_yn) {
          this.renew.ma_vt = result.result[0].ma_vt;
          this.renew.ten_vt = result.result[0].ten_vt;
          this.renew.dvt = result.result[0].dvt;

          // gán isValidItemOld = false để KHÔNG cho chọn vt khi vt đã có trong hệ thống
          this.isValidItemOld = false;
        } else {
          // gán isValidItemOld = true để cho chọn vt khi vt ko có trong hệ thống
          this.isValidItemOld = true;
        }
      }
    });
  }

  // Nhập loại hàng
  openSearchTypeMerchandiseDialog3() {
    const { ma_cuahang } = this.ticket.masterInfo;
    if (!(ma_cuahang == '' || this.renew.ma_vt == '' || this.renew.ma_ncc == '')) {
      const initFilter = [
        { name: 'ma_cuahang', value: ma_cuahang },
        { name: 'ma_ncc', value: this.renew.ma_ncc },
        { name: 'ma_vt', value: this.renew.ma_vt }
      ];

      this.commonService.openDialog(SearchDialogComponent, { keyword: '', componentName: SEARCH_COMPONENT_NAME.TYPE_RENEW, filter: initFilter })
        .afterClosed().subscribe(result => {
          if (result) {
            this.renew.loai_hh = result.ten_loai;
            this.renew.ma_loai = result.ma_loai;
            this.renew.gia_nt = result.gia_nt;
            this.renew.gia_mua = result.gia_nt;
            this.renew.ma_ncc = result.ma_kh;

            // const ngay_ct = new Date(`${this.ticket.masterInfo.ngay_ct}Z`);
            let ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
            const vc_date = formatDate(ngay_ct, 'yyyy/MM/dd', 'en_US');
            ngay_ct = new Date(`${vc_date}Z`);

            this.saleRepurchaseService.getOldProgram(
              this.renew.ma_ncc,
              ngay_ct,
            )?.pipe().subscribe(result => {
              if (result && result.success && result.result) {
                const response = result?.result as any;

                this.renew.ma_cttc = response.ma_cttc || '';
                this.renew.ten_cttc = response.ten_cttc || '';

                // lấy ra kho theo ma_nh từ: khai báo mức hỗ trợ hàng thu cũ
                this.saleRepurchaseService.getTypeStock(this.renew.ma_cttc, this.renew.ma_ncc, ngay_ct)?.subscribe(result => {
                  if (result.success) {
                    const { loai_kho_nhap, ten_loai } = result.result as any;

                    this.repurchase.loai_hh = ten_loai || "";
                    this.repurchase.ma_loai = loai_kho_nhap || "";

                    this.ticketApiService.getStocks2(TICKET_ENTITY.REPURCHASE, {
                      ma_cuahang: this.ticket.masterInfo.ma_cuahang,
                      ma_nh: loai_kho_nhap || ""
                    }).subscribe(result => {
                      if (result.success) {
                        const { ma_kho } = result.result as any;
                        this.repurchase.ma_kho = ma_kho || '';
                      } else {
                        this.repurchase.ma_kho = '';
                        this.commonService.showMessage('Không lấy được kho nhập hàng thu cũ');
                      }
                    });
                  } else {
                    this.repurchase.loai_hh = '';
                    this.repurchase.ma_loai = '';
                    this.commonService.showMessage('Không lấy được loại kho hàng');
                  }
                });

              } else {
                this.renew.ma_cttc = '';
                this.renew.ten_cttc = '';
                this.commonService.showMessage('Không lấy được chương trình thu cũ');
              }
            });
          }
        });
    }
    else {
      this.commonService.showMessage('Phải chọn mã vật tư nhập và đại lý thu cũ trước');
    }
  }

  // Đại lý thu cũ
  openSearchSupplierDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.OLD_RECEIVER_SUPPLIER, filter: [{ name: 's4', value: 1, operator: '=' }] }, 'search-style-dialog')
      .afterClosed()
      .subscribe((empl: Customer) => this.handleAddSupplier(empl));
  }

  handleAddSupplier(empl: any) {
    this.renew.ma_ncc = empl.ma_kh;
    this.resetRew();
  }

  resetRew() {
    this.renew.loai_hh = '';
    this.renew.ma_loai = '';
    this.renew.ma_cttc = '';
    this.renew.ten_cttc = '';
    this.renew.gia_nt = 0;
    this.renew.gia_mua = 0;
  }

  updateRepurchaseOld() {
    // kiểm tra các input của loại gd 3 đã nhập đủ hay chưa
    const message = this.validateRenew();
    if (message) {
      this.commonService.showMessage(message);
      return;
    }

    // kiểm tra giá mua điều chỉnh có vượt tỉ lệ khai báo ko
    // const ngay_ct = new Date(`${this.ticket.masterInfo.ngay_ct}Z`);
    let ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    const vc_date = formatDate(ngay_ct, 'yyyy/MM/dd', 'en_US');
    ngay_ct = new Date(`${vc_date}Z`);

    this.saleRepurchaseService.adjustBuyPrice(
      ngay_ct,
      this.renew.ma_ncc,
      this.renew.ma_loai,
      this.renew.ma_vt,
      this.renew.gia_nt,
      this.renew.gia_mua
    )?.pipe().subscribe(result => {
      if (result && result.success && result.result) {
        const response = result?.result[0] as any;

        if (response.tl_tang_invalid) {
          this.commonService.showMessage(`Tỷ lệ tăng không được vượt quá ${response.tl_tang || 0}%`);
          return;
        }
        if (response.tl_giam_invalid) {
          this.commonService.showMessage(`Tỷ lệ giảm không được vượt quá ${response.tl_giam || 0}%`);
          return;
        }

        const merchandise = new Merchandise;
        merchandise.gia_ban = this.renew.gia_mua;
        merchandise.s4 = this.renew.gia_mua;
        merchandise.thanh_tien = merchandise.gia_ban * merchandise.so_luong;
        merchandise.tt = merchandise.s4 * merchandise.so_luong;
        merchandise.tien_thue = merchandise.tt - merchandise.thanh_tien;
        merchandise.ma_kho = this.repurchase.ma_kho;
        merchandise.ma_loai = this.repurchase.ma_loai;
        merchandise.ten_vt = this.renew.ten_vt;
        merchandise.ma_vt = this.renew.ma_vt;
        merchandise.ma_imei = this.renew.ma_imei;
        merchandise.dvt = this.renew.dvt;
        merchandise.ma_td3 = this.renew.ma_loai;
        merchandise.ma_td2 = this.renew.ma_ncc;
        merchandise.sl_td1 = this.renew.gia_nt;
        merchandise.ma_td1 = this.renew.ma_cttc;
        this.merchandiseService.addNewRepurchase(merchandise, this.ticket.merchandise, Merchandise);
        this.clearDataRenew();
        this.saleRepurchaseService.calcMoney();
      } else {
        this.commonService.showMessage('Lỗi kiểm tra giá mua điều chỉnh');
      }
    });
  }

  clearDataRenew() {
    this.renew.ma_imei = '';
    this.renew.ma_kho = '';
    this.renew.ma_vt = '';
    this.renew.ten_vt = '';
    this.renew.loai_hh = '';
    this.renew.gia_nt = 0;
    this.renew.gia_mua = 0;
    this.renew.ma_loai = '';
    this.renew.dvt = '';
    this.renew.ma_kho = '';
    this.renew.ma_ncc = '';
  }

  onChangeBuyPrice(event: any) {
    this.renew.gia_mua = event
  }

  validateRenew(): string | null {
    if (!this.renew.ma_imei) {
      return 'Chưa nhập mã imei';
    }
    if (!this.renew.ma_vt) {
      return 'Chưa nhập mã vật tư';
    }
    if (!this.renew.loai_hh) {
      return 'Chưa nhập loại hàng hóa';
    }
    if (!this.renew.ma_ncc) {
      return 'Chưa nhập đại lý thu cũ';
    }
    if (!this.renew.gia_nt) {
      return 'Chưa nhập giá theo bảng giá';
    }
    if (!this.renew.gia_mua) {
      return 'Chưa nhập giá mua';
    }
    if (this.ticket.merchandise.length > 0) {
      return 'Loại giao dịch 3 chỉ được 1 imei trên phiếu';
    }
    if (!this.renew.ma_cttc) {
      return 'Chưa có chương trình thu cũ';
    }
    if (!this.renew.ma_loai) {
      return 'Chưa có mã loại';
    }
    return null;
  }
  // #endregion 3.mua thu cũ không lên đời
}
