import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleWholeService } from './sale-whole.service';
import { Merchandise, WholeTicketCreate } from '@app/sales-management/model/ticket/whole/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../component/search/serach-dialog.component';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { CommonService } from '../common/common.service';
import { MerchandiseService } from '../common/merchandise.service';
import { MODE, STATUS_LIST } from '@app/sales-management/enum/ticket.enum';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { Language } from '../common/language';
import { EInvoiceInfo, EInvoiceInfoOutput } from '@app/sales-management/model/dto/einvoice.dto';
import { InternalSaleDetailService } from '@app/_components/voucher/inventory/internal-sale/create/internal-sale-detail.service';
import { DialogConfirmComponent } from '@app/_components/dialog/dialog-confirm/dialog-confirm.component';
import { PrinterComponent } from '@app/_components/printer/printer.component';

const { GUARANTEE_LIST, MERCHANDISE_LIST_WHOLESALE, SERVICE_LIST } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-whole',
  templateUrl: './sale-whole.component.html',
  styleUrls: ['./sale-whole.component.scss'],
})
export class SaleWholeComponent implements OnInit, AfterViewInit {
  ticket: WholeTicketCreate = new WholeTicketCreate;
  statusList: StatusTicket[] = [];
  dataFormat = dataFormat;
  title = '';
  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  merchandiseColumns = MERCHANDISE_LIST_WHOLESALE;
  serviceColumns = SERVICE_LIST;
  guaranteeColumns = GUARANTEE_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  isSaving = false;
  isDisabled = false;
  tabIndex = {
    so_ct_hd: 0,
    imei: 2,
    ma_vt: 3,
  };
  disableSelectStatus = false;
  statuses = {
    CREATE: '0',
    COMPLETE: '2'
  };
  modes = MODE;
  tabIndexFocusFirst = 0;
  eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
  conversionPoints = 0;
  eInvoiceInfoOutput: EInvoiceInfoOutput = new EInvoiceInfoOutput();
  itemSelected!: Merchandise;
  entity = TICKET_ENTITY.WHOLE;
  action = '';
  shop = '';
  isCreateDraftInvoice = false;
  isGetInvoice = false;
  isGetPdfInvoice = false;
  invoice_model_status = '0';

  tab_sources: any[] = [
    { label: 'Hàng hoá', name: 'merchandise' },
    { label: 'Bảo hành', name: 'guarantee' },
    { label: 'Vận chuyển' },
    { label: 'Hồ sơ hợp đồng' },
    { label: 'HĐĐT' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleWholeService: SaleWholeService,
    public dialog: MatDialog,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    public internalSaleDeatailService: InternalSaleDetailService,
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleWholeService.setTicket(this.ticket);
  }

  // get tabList() {
  //   return [
  //     { label: 'Hàng hoá', count: this.ticket?.merchandise?.length ?? 0 },
  //     { label: 'Bảo hành', count: this.ticket?.guarantee?.length ?? 0 },
  //     { label: 'Vận chuyển' },
  //     { label: 'Hồ sơ hợp đồng' },
  //     { label: 'HĐĐT' }
  //   ];
  // }

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
            this.disableSelectStatus = false;
            this.mode = MODE.UPDATE;
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

    this.getStatusList();

    this.route.queryParams.subscribe((data: any) => {
      const { key, fromContract } = data;
      const ticketEntity = fromContract ? TICKET_ENTITY.CONTRACT : TICKET_ENTITY.WHOLE;

      if (fromContract) {
        this.ticketApiService.getVoucherByid(ticketEntity, key).subscribe((result: any) => {
          // set cửa hàng để truyền sang payment tab
          this.shop = (result.result as any).masterInfo.ma_cuahang;

          //set status để xử lý vấn đề in ngay trên màn hình xem chứng từ
          this.invoice_model_status = (result.result as any).masterInfo.status;

          this.saleWholeService.initTicket(this.ticket);
          this.getStatusList();
          this.commonService.getPointRateExchange(this.ticket);
          result && this.saleWholeService.loadDataMerchandiseFromContract(result.result);
          //Reset các trường tiền bằng 0
          const merchandiseList = result.result.details[0];
          this.ticket.merchandise = merchandiseList.data.map((item: any) => {
            const merchandiseItem = new Merchandise(item);
            merchandiseItem.gia_ban = Math.round(item.gia_nt2);
            merchandiseItem.tien_thue = 0;
            merchandiseItem.thanh_tien = 0;
            merchandiseItem.thanh_toan = 0
            return merchandiseItem;
          });
        });
      } else if (key && !fromContract) {
        this.ticketApiService.getVoucherByid(ticketEntity, key).subscribe((result: any) => {
          if (result.success && result.result) {
            // Chỉ cho phép sửa khi trạng thái là 0, 1, 3
            if (this.mode === MODE.UPDATE &&
              !((result.result as any).masterInfo.status === STATUS_LIST.SALE_WHOLE.CREATE
                || (result.result as any).masterInfo.status === STATUS_LIST.SALE_WHOLE.PENDING_PAYMENT
                || (result.result as any).masterInfo.status === STATUS_LIST.SALE_WHOLE.PENDING_PUBLISH
              )) {
              this.router.navigate(['/404']);
            }

            // set cửa hàng để truyền sang payment tab
            this.shop = (result.result as any).masterInfo.ma_cuahang;

            //set status để xử lý vấn đề in ngay trên màn hình xem chứng từ
            this.invoice_model_status = (result.result as any).masterInfo.status;

            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            this.saleWholeService.loadData(result.result as any as VoucherDto, this.mode);
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei.split(';')).flat());
            this.getStatusList();
            this.commonService.getPointRateExchange(this.ticket);
            this.saleWholeService.getConversionPoint().subscribe(result => {
              if (result && result.success && result.result !== null) {
                this.conversionPoints = result.result;
                // this.ticket.payment.sd_diem.diem_qd = result.result;
              }
            });
            this.tabIndexFocusFirst = this.tabIndex.imei;
          }
        });
      } else {
        this.saleWholeService.initTicket(this.ticket);
        this.getStatusList();
        this.commonService.getPointRateExchange(this.ticket);
        this.tabIndexFocusFirst = this.tabIndex.so_ct_hd;
      }
    });
  }

  getStatusList = () => {
    this.ticketApiService.getStatusWithOrder([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.WHOLE }], 'xorder,status').subscribe(result => {
      const allItems = result.result.items as StatusTicket[];
      const currentStatus = this.ticket.masterInfo.status;

      if (currentStatus === '1') {
        // Nếu là "Chờ thanh toán" → loại bỏ "Lập chứng từ", "Hoàn thành"
        this.statusList = allItems.filter(item => item.status !== '0' && item.status !== '2');
      } else if (currentStatus === '0') {
        // Nếu là "Lập chứng từ" → loại bỏ "Chờ thanh toán", "Hoàn thành"
        this.statusList = allItems.filter(item => item.status !== '1' && item.status !== '2');
      } else if (currentStatus === '3') {
        // Nếu là "Chờ phát hành" → chỉ hiện "Chờ phát hành", "Hoàn thành"
        this.statusList = allItems.filter(item => item.status === '3' || item.status === '2');
      }
      else {
        // Các trạng thái khác → giữ nguyên
        this.statusList = allItems;
      }
    });
  };

  // #region customer
  handleAddCustomer(ma_kh: string) {
    this.saleWholeService.setInfoCustomer(ma_kh);

    this.saleWholeService.getConversionPoint().subscribe(result => {
      if (result && result.success && result.result !== null) {
        this.conversionPoints = result.result;
        this.ticket.payment.sd_diem.diem_qd = result.result;
      }
    });
  }
  //#endregion customer

  // #region contract
  onEnterContractCode(ma_kh: string) {

  }

  openSearchContractDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.CONTRACT })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.handleAddCustomer(result.ma_kh);
          this.ticketApiService.getVoucherByid(TICKET_ENTITY.CONTRACT, result.stt_rec).subscribe((data: any) => {
            if (data && data.success) {
              const merchandiseList = data.result.details[0];
              this.ticket.merchandise = merchandiseList.data.map((item: any) => {
                const merchandiseItem = new Merchandise(item);
                merchandiseItem.gia_ban = item.gia_nt2;
                return merchandiseItem;
              });
              this.saleWholeService.setContactInfo(data.result.masterInfo);
            }
          });
        }
      });
  }

  //#endregion contract

  // #region imei
  handleAddImei(ma_imei: string, merchandise: Merchandise) {
    this.saleWholeService.calcMoneyMerchandise(merchandise);
    if (!merchandise.ma_imei) {
      merchandise.ma_imei = ma_imei;
    } else {
      merchandise.ma_imei += `, ${ma_imei}`;
    }
    this.saleWholeService.calcMoney();
    this.commonService.clearText([this.tabIndex.imei, this.tabIndex.ma_vt]);
  }

  onEnterImeiCode(ma_imei: string) {
    if (this.ticket.contractInfo.so_ct_hd === '') {
      this.commonService.showMessageByName('lblWarningNotSelectContract');
      return;
    } else {
      const list_imei: string[] = [];
      this.ticket.merchandise.forEach(item => {
        if (item.ma_imei) {
          list_imei.push(...item.ma_imei.split(',').map((x: any) => x.trim()));
        }
      });
      if (list_imei.find(x => x == ma_imei.trim())) {
        this.commonService.showMessageByNameAdvance('lblWarningExistImei', { name: '%imei', value: ma_imei });
        return;
      }
      const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
      this.saleWholeService.getImeiInStore(ma_imei, ngay_ct).subscribe(result => {
        if (result.success && result.result.length) {
          const imeiInfo = result.result[0];
          const merchandise = this.merchandiseService.getMerchandiseByMaVTAndMaKho(imeiInfo.ma_vt, imeiInfo.ma_kho || '', this.ticket.merchandise);
          if (merchandise) {
            if (merchandise.so_luong_imei < merchandise.so_luong) {
              this.handleAddImei(imeiInfo.ma_imei, merchandise);
              // this.imeiApiService.updateImeiState([ma_imei], true).subscribe(result => {
              //   if (result.success && result.result[0].dat_hang_yn) {
              //     this.handleAddImei(imeiInfo.ma_imei, merchandise);
              //   }
              // });
            } else {
              this.commonService.showMessageByName('lblWarningMaxQuantity');
            }
          } else {
            this.commonService.showMessageByName('lblWarningNotExistItemInDetail');
          }
        }
        else {
          this.commonService.showMessageByNameAdvance(result.message, { name: '%imei', value: ma_imei });
        }
      });
    }
  }

  onClickEditImeiButton() {
    if (!this.itemSelected) {
      this.commonService.showMessageByName('lblWarningEditRowIMEI');
      return;
    }
    let list_imei: string[] = [];
    if (this.itemSelected) {
      if (this.itemSelected.ma_imei) {
        list_imei = this.itemSelected.ma_imei.split(',');
        list_imei = list_imei.map((item: any) => {
          return item.trim();
        });
        this.itemSelected.ma_imei = list_imei;
      }
    }

    this.saleWholeService.openDialogIMEI(this.itemSelected).subscribe((value) => {
      if (value) {
        /*
        * Kiểm tra trùng IMEI
        */
        // Lấy danh sách tất cả IMEI đã tồn tại từ merchandise
        const existingIMEIs = this.ticket.merchandise
          .flatMap(item => (Array.isArray(item.ma_imei) ? item.ma_imei : []));
        // Lấy danh sách IMEI đã có trong `itemSelected`
        const currentIMEIs = this.itemSelected && this.itemSelected.ma_imei
          ? (Array.isArray(this.itemSelected.ma_imei)
            ? this.itemSelected.ma_imei
            : this.itemSelected.ma_imei.split(',').map((imei: string) => imei.trim()))
          : [];
        // Lọc ra danh sách IMEI mới để kiểm tra
        const newIMEIs = value.filter((imei: any) => !currentIMEIs.includes(imei));
        // Tìm các IMEI bị trùng chỉ trong danh sách IMEI mới
        const duplicateIMEIs = newIMEIs.filter((imei: any) => existingIMEIs.includes(imei));
        if (duplicateIMEIs.length > 0) {
          this.commonService.showMessage(`Các imei sau đã tồn tại trong chi tiết: ${duplicateIMEIs.join(', ')}`);
          return;
        }
        /* END */

        this.itemSelected.ma_imei = value.join(', ');
        this.itemSelected.so_luong_imei = value.length;
        this.itemSelected.gia_vat = this.itemSelected.gia_full_vat;
        this.itemSelected.gia_ban = Math.round(this.itemSelected.gia_vat / (1 + this.itemSelected.thue_suat / 100));
        this.itemSelected.thanh_tien = this.itemSelected.gia_ban * this.itemSelected.so_luong_imei;
        this.itemSelected.thanh_toan = this.itemSelected.gia_full_vat * this.itemSelected.so_luong_imei;
        this.itemSelected.tien_thue = this.itemSelected.thanh_toan - this.itemSelected.thanh_tien;
        this.saleWholeService.calcMoney();
      }
      else {
        this.itemSelected.ma_imei = this.itemSelected.ma_imei.join(', ');
      }
    });

  }

  onSelectedItem($event: any) {
    this.itemSelected = $event.item;
  }

  onClickCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      result && this.onEnterImeiCode(result);
    });
  }

  // #endregion imei

  // #region merchandise
  openMerchandiseDialog(ma_vt?: string) {
    this.commonService.openDialog(SearchDialogComponent, { keyword: ma_vt || '', componentName: SEARCH_COMPONENT_NAME.MERCHANDISE })
      .afterClosed().subscribe(result => {
        if (result) {
          this.onEnterImeiCode(result.ma_imei);
        }
      });
  }

  onEnterMerchandiseCode(ma_vt: string) {
    this.openMerchandiseDialog(ma_vt);
  }

  // #endregion merchandise


  // Submit Ticket

  handleSaveTicket(voucherDto: VoucherDto) {
    this.route.queryParams.subscribe((data: any) => {
      if (this.mode === MODE.UPDATE && !this.isSaving) {
        this.isSaving = true;
        this.isDisabled = true;
        this.ticketApiService.updateVoucher(TICKET_ENTITY.WHOLE, voucherDto).subscribe(result => {
          this.isSaving = false;
          this.isDisabled = false;
          if (result.success) {
            // this.commonService.clearImeiStorage();
            this.commonService.showMessageByName(result.message || Language.content.Update_Completed);
            this.router.navigate(['sales/whole']);
          } else {
            this.commonService.handleResponseErrorVoucher(result, 'sales/whole');
          }
        });
      } else if (this.mode === MODE.CREATE && !this.isSaving) {
        this.isSaving = true;
        this.isDisabled = true;
        this.ticketApiService.addNewVoucher(TICKET_ENTITY.WHOLE, voucherDto).subscribe(result => {
          this.isSaving = false;
          this.isDisabled = false;
          if (result.success) {
            // this.commonService.clearImeiStorage();
            this.commonService.showMessageByName(result.message || Language.content.Successful_Create);
            this.router.navigate(['sales/whole']);
          } else {
            this.commonService.handleResponseErrorVoucher(result, 'sales/whole');
          }
        });
      }
    });
  }

  // Submit
  onSave() {
    // Check âm tiền nợ
    if (this.ticket.masterInfo.t_con_no < 0) {
      this.commonService.showMessage('Tiền nợ không được âm');
      return;
    }

    //Check imei trùng trong grid chi tiết
    const mechandise_dup = [];
    let lineNumber = 0;
    for (const item of this.ticket.merchandise) {
      lineNumber++;
      // Tách từng IMEI từ ma_imei
      const imeis = item.ma_imei ? item.ma_imei.split(',').map((imei: string) => imei.trim()) : [];
      const duplicates = imeis.filter((imei: any, index: any) => imeis.indexOf(imei) !== index);

      if (duplicates.length > 0) {
        mechandise_dup.push({ line: lineNumber, duplicates });
      }

      if (item.so_luong_imei < item.so_luong && this.ticket.masterInfo.status == '2') {
        this.commonService.showMessage('Vui lòng nhập đầy đủ Imei');
        return;
      }
    }
    if (mechandise_dup.length > 0) {
      const message = mechandise_dup
        .map(dup => `Dòng ${dup.line} có các IMEI sau bị trùng: ${dup.duplicates.join(', ')}`)
        .join('\n'); // Gộp các dòng thành một thông báo duy nhất
      this.commonService.showMessage(message);
      return;
    }

    const message = this.saleWholeService.validateTicket(this.ticket);
    this.invalid = this.commonService.isInValidPayment(this.ticket.payment) || this.saleWholeService.isInvalidForm(this.ticket.masterInfo);
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.saleWholeService.prepareVoucher();
      if (this.ticket.contractFile.co_file || this.ticket.contractFile.cq_file) {
        this.saleWholeService.handleUploadFileContract().subscribe(result => {
          if (result && result.success) {
            this.handleSaveTicket(voucherDto);
          } else {
            this.commonService.showMessageByName('lblWarningInvalidFileType');
          }
        });
      } else {
        this.handleSaveTicket(voucherDto);
      }
    }
  }

  onCancel() {
    this.router.navigate(['sales/whole']);
    // const imeis = this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei);
    // if (imeis.length > 0) {
    //   this.imeiApiService.updateImeiState(imeis, false).subscribe(result => {
    //     if (result.success) {
    //       this.router.navigate(['sales/whole']);
    //     } else {
    //       this.commonService.showMessage('Lỗi update state của hàng hóa');
    //     }
    //   });
    // } else {
    //   this.router.navigate(['sales/whole']);
    // }

  }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  // xử lý trước khi thực hiện hàm onSave()
  beforeSave() {
    // nếu là CREATE thực hiện valid
    if (this.mode === MODE.CREATE) {
      /*
      const title = 'Có lập HĐĐT (nháp) cho phiếu xuất bán hàng này hay không?';
      this.commonService.openDialog(DialogConfirmComponent, { title: title })
        .afterClosed().subscribe(result => {
          if (result) {
            const { hd_mst, hd_email, hd_ten_kh, hd_dia_chi } = this.ticket.masterInfo;
            if (!hd_mst || !hd_email || !hd_ten_kh || !hd_dia_chi) {
              this.commonService.showMessageByName('invoice_info_not_enough');
              return;
            }
          }

          // Gán flag cho BE biết
          this.ticket.masterInfo.fnote3 = result ? '1' : '0';

          // Gọi submit như bình thường
          this.onSave();
        });
      */

      // comment code phía trên và sửa lại như sau:
      // - Mặc định check phải nhập đủ thông tin hóa đơn điện tử mới cho lưu phiếu với status "hoàn thành"
      // - Hoàn thành phiếu sẽ chưa xử lý lập nháp hđ đt ngay, người dùng sẽ chủ động quay lại mở phiếu và click button "lập nháp HĐĐT"
      this.ticket.masterInfo.fnote2 = this.ticket.masterInfo.fnote2 ? this.ticket.masterInfo.fnote2 : '0';
      const objEinvoice = this.ticket.masterInfo.fnote2;
      const { hd_mst, hd_ten_kh, hd_dia_chi, hd_nguoi_mua } = this.ticket.masterInfo;

      if (objEinvoice == '0' && (!hd_nguoi_mua)) {
        this.commonService.showMessageByName('invoice_individuals_info');
        return;
      }
      if (objEinvoice == '1' && (!hd_mst || !hd_ten_kh || !hd_dia_chi)) {
        this.commonService.showMessageByName('invoice_bussiness_info');
        return;
      }
      const hd_loai_giay_to = this.ticket.masterInfo.hd_loai_giay_to;
      const hd_so_giay_to = this.ticket.masterInfo.hd_so_giay_to;
      if ((hd_loai_giay_to == '1' || hd_loai_giay_to == '2') && !hd_so_giay_to) {
        this.commonService.showMessageByName('invoice_papersType_info');
        return;
      }
      this.ticket.masterInfo.fnote3 = '0';
      this.onSave();

    } else {
      // Không cần hỏi → submit luôn
      this.ticket.masterInfo.fnote3 = '0';
      this.onSave();
    }
  }

  // #region EInvoice
  handleCreateDraftInvoice() {
    if (this.ticket.masterInfo.status === '0') {
      const title = 'Có lập HĐĐT (nháp) cho phiếu xuất bán hàng này hay không?';

      this.commonService.openDialog(DialogConfirmComponent, { title: title })
        .afterClosed().subscribe(result => {
          if (result) {
            this.onCreateDraft();
          }
        });
    }
  }

  handleGetInvoice() {
    let title = 'Có lấy HĐĐT cho phiếu bán hàng này hay không?';

    this.commonService.openDialog(DialogConfirmComponent, { title: title })
      .afterClosed().subscribe(result => {
        if (result) {
          this.isGetInvoice = true;

          this.internalSaleDeatailService.getPublishedInv(this.ticket).subscribe((res: any) => {
            if (res.result.errorCode) {
              this.commonService.showMessage(res.result.description);
              this.isGetInvoice = false;
              return;
            }
            if (res) {
              this.commonService.showMessageByName(res.message);
              location.reload();
            }
          }, (err: any) => {
            this.isGetInvoice = false;
            this.commonService.showMessageByName(err);
          });
        } else {
          this.isGetInvoice = false;
        }
      });
  }

  handleGetPDFInvoice() {
    let title = 'Có lấy PDF HĐĐT cho phiếu bán hàng này hay không?';

    this.commonService.openDialog(DialogConfirmComponent, { title: title })
      .afterClosed().subscribe(result => {
        if (result) {
          this.isGetPdfInvoice = true;

          let dialogRef: any = null;
          this.internalSaleDeatailService.getPdfFile(this.ticket).subscribe((res: any) => {
            if (res.success && res?.result && res?.result?.fileToBytes) {
              const pdfBase64 = 'data:application/pdf;base64,' + res?.result?.fileToBytes;
              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = '100%';
              dialogConfig.height = '90%';
              dialogConfig.disableClose = true;
              dialogConfig.data = {
                title: res?.result?.fileName || 'Hóa đơn điện tử',
                pdf: pdfBase64
              };
              dialogRef = this.dialog.open(PrinterComponent, dialogConfig);
              this.isGetPdfInvoice = false;
            } else {
              this.isGetPdfInvoice = false;
              this.commonService.showMessageByName(res.message || 'Không có dữ liệu hóa đơn điện tử');
            }
          }, (err: any) => {
            this.isGetPdfInvoice = false;
            this.commonService.showMessageByName(err);
          });
          return dialogRef;
        } else {
          this.isGetPdfInvoice = false;
        }
      });
  }

  handleGetPDFInvoiceDraft() {
    let title = 'Có lấy PDF HĐĐT nháp cho phiếu này hay không?';

    this.commonService.openDialog(DialogConfirmComponent, { title: title })
      .afterClosed().subscribe(result => {
        if (result) {
          this.isGetPdfInvoice = true;

          let dialogRef: any = null;
          this.internalSaleDeatailService.getPdfFile(this.ticket, 'draft').subscribe((res: any) => {
            if (res.success && res?.result && res?.result?.fileToBytes) {
              const pdfBase64 = 'data:application/pdf;base64,' + res?.result?.fileToBytes;
              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = '100%';
              dialogConfig.height = '90%';
              dialogConfig.disableClose = true;
              dialogConfig.data = {
                title: res?.result?.fileName || 'Hóa đơn điện tử',
                pdf: pdfBase64
              };
              dialogRef = this.dialog.open(PrinterComponent, dialogConfig);
              this.isGetPdfInvoice = false;
            } else {
              this.isGetPdfInvoice = false;
              this.commonService.showMessageByName(res.message || 'Không có dữ liệu hóa đơn điện tử');
            }
          }, (err: any) => {
            this.isGetPdfInvoice = false;
            this.commonService.showMessageByName(err);
          });
          return dialogRef;
        } else {
          this.isGetPdfInvoice = false;
        }
      });
  }

  onCreateDraft() {
    this.isCreateDraftInvoice = true;

    this.internalSaleDeatailService.createDraft(this.ticket).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonService.showMessageByName(result.message || 'create_draft_invoice_success');
        } else {
          this.commonService.showMessageByName(result.message || 'Unknown_err');
        }
      },
      error: (err) => {
        this.commonService.showMessageByName('Unknown_err');
        console.error('Draft invoice error:', err);
        this.isCreateDraftInvoice = false;
      },
      complete: () => {
        this.isCreateDraftInvoice = false;
      }
    });
  }

  //#endregion

  //#region Readonly
  isInputDisabled() {
    const hasSelectedPayment = Object.values(this.ticket?.payment ?? {}).some(p => p?.selected === true);
    return hasSelectedPayment;
  }

  isInputDisabledStatus(): boolean {
    const hasReadonlyOrDisabled = this.readonly || this.disableSelectStatus;
    return hasReadonlyOrDisabled;
  }

  isDiscountReadonly(): boolean {
    return this.readonly || this.invoice_model_status === '3';
  }

  isInputReadonly() {
    const isReadonlyFlag = this.readonly;
    const hasSelectedPayment = Object.values(this.ticket?.payment ?? {}).some(p => p?.selected === true);

    return isReadonlyFlag || hasSelectedPayment;
  }

  isAnyPaymentSelected(): boolean {
    return Object.values(this.ticket.payment).some(p => p?.selected === true);
  }
  //#endregion

  onPaymentChange($event: any) {
    this.ticket.masterInfo.t_con_no = $event.t_con_no;
    this.ticket.masterInfo.t_da_tra = $event.t_da_tra;
    this.ticket.masterInfo.t_gg = $event.t_gg;
    this.ticket.masterInfo.nguoi_duyet_ck = $event.nguoi_duyet_ck
    this.ticket.masterInfo.status = $event.status;

    // cập nhật lại trạng thái
    this.getStatusList();
  }

}


