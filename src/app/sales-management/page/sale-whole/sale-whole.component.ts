import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleWholeService } from './sale-whole.service';
import { Merchandise, WholeTicketCreate } from '@app/sales-management/model/ticket/whole/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog } from '@angular/material/dialog';
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
import { MODE } from '@app/sales-management/enum/ticket.enum';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { Language } from '../common/language';
import { EInvoiceInfo, EInvoiceInfoOutput } from '@app/sales-management/model/dto/einvoice.dto';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleWholeService: SaleWholeService,
    public dialog: MatDialog,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleWholeService.setTicket(this.ticket);
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
            break;
          case 'update':
            this.title = Language.content.edit;
            this.disableSelectStatus = false;
            this.mode = MODE.UPDATE;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.WHOLE }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.subscribe((data: any) => {
      const { key, fromContract } = data;
      const ticketEntity = fromContract ? TICKET_ENTITY.CONTRACT : TICKET_ENTITY.WHOLE;

      if (fromContract) {
        this.ticketApiService.getVoucherByid(ticketEntity, key).subscribe((result: any) => {
          this.saleWholeService.initTicket(this.ticket);
          getStatusList();
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
            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== this.statuses.CREATE) {
              this.router.navigate(['/404']);
            }
            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            this.saleWholeService.loadData(result.result as any as VoucherDto, this.mode);
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei.split(';')).flat());
            getStatusList();
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
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket);
        this.tabIndexFocusFirst = this.tabIndex.so_ct_hd;
      }
    });
  }

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
      this.saleWholeService.getImeiInStore(ma_imei).subscribe(result => {
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
        this.itemSelected.ma_imei = value.join(', ');
        this.itemSelected.so_luong_imei = value.length;
        this.itemSelected.gia_vat = this.itemSelected.gia_full_vat;
        this.itemSelected.gia_ban = Math.round(this.itemSelected.gia_vat / (1 + this.itemSelected.thue_suat / 100));
        this.itemSelected.thanh_toan = this.itemSelected.gia_vat * this.itemSelected.so_luong_imei;
        this.itemSelected.thanh_tien = this.itemSelected.gia_ban * this.itemSelected.so_luong_imei;
        this.itemSelected.tien_thue = Math.max(this.itemSelected.thanh_toan - this.itemSelected.thanh_tien, 0);
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
        this.ticketApiService.updateVoucher(TICKET_ENTITY.WHOLE, voucherDto).subscribe(result => {
          this.isSaving = false;
          if (result.success) {
            // this.commonService.clearImeiStorage();
            this.commonService.showMessage(Language.content.Update_Completed);
            this.router.navigate(['sales/whole']);
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
        this.ticketApiService.addNewVoucher(TICKET_ENTITY.WHOLE, voucherDto).subscribe(result => {
          this.isSaving = false;
          if (result.success) {
            // this.commonService.clearImeiStorage();
            this.commonService.showMessage(Language.content.Successful_Create);
            this.router.navigate(['sales/whole']);
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

  // Submit
  onSave() {
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
}


