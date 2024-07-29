import { AfterViewInit, Component, OnInit } from '@angular/core';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '@app/sales-management/component/search/serach-dialog.component';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { MerchandiseService } from '@app/sales-management/page/common/merchandise.service';
import { MODE } from '@app/sales-management/enum/ticket.enum';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { Language } from '@app/sales-management/page/common/language';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { Merchandise, StockTransferTicket } from './model/model';
import { StockTransferService } from './stock-transfer.service';
import { STATUS, STOCK_TRANSFER_TICKET_CODE, STOCK_TRANSFER_TICKET_ENTITY } from './model/constants';
import { ImportImeiComponent } from './import-imei/import-imei/import-imei.component';
import { IMEIService } from '@app/_services/imei.service';

const {
  MERCHANDISE_LIST
} = require('@assets/fields/grid/voucher-stock-transfer-from-shop.json');

@Component({
  selector: 'app-retail',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss'],
})
export class StockTransferComponent implements OnInit, AfterViewInit {
  ticket: StockTransferTicket = new StockTransferTicket;
  statusList: StatusTicket[] = [];
  dataFormat = dataFormat;
  title = '';
  merchandiseColumns = MERCHANDISE_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  isSaving = false;
  tabIndex = {
    imei: 1,
  };
  disableSelectStatus = false;
  imageCutomerFile?: File;
  tabIndexFocusFirst = 1;
  conversionPoints = 0;
  list_imei_old: string[] = [];
  option: Option = new Option;
  entity = STOCK_TRANSFER_TICKET_ENTITY;
  transactionTypeOptions = [
    {
      label: "1-Luân chuyển kho tại cửa hàng",
      value: 1
    },
    {
      label: "2-Chuyển hàng lỗi về kho tổng",
      value: 2
    }
  ]
  kho_nhap_datasource = [];
  kho_xuat_datasource = [];
  ma_loai = "";
  stock: any[] = JSON.parse(localStorage.getItem('stock') || "[]");

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stockTransferService: StockTransferService,
    public dialog: MatDialog,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private imeiService: IMEIService
  ) {
    localStorage.setItem('useGridCached', '1');
    this.stockTransferService.setTicket(this.ticket, this.option);
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
            this.mode = MODE.UPDATE;
            this.disableSelectStatus = false;
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: STOCK_TRANSFER_TICKET_CODE }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.ticket.masterInfo.fnote2 = this.transactionTypeOptions as any;

    this.route.queryParams.pipe().subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(STOCK_TRANSFER_TICKET_ENTITY, data.key).subscribe((result) => {
          if (result.result) {
            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS.CREATE) {
              this.router.navigate(['/404']);
            }
            this.stockTransferService.loadData(result.result as any as VoucherDto);
            this.list_imei_old = this.ticket.merchandise.map(x => x.ma_imei);
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
            getStatusList();
            this.tabIndexFocusFirst = this.tabIndex.imei;
          }
        });
      } else {
        this.stockTransferService.initTicket(this.ticket);
        getStatusList();
        this.tabIndexFocusFirst = this.tabIndex.imei;
      }
    });
  }

  // #region master info
  onChangeImportStore(event: any) {
    if (this.ticket.masterInfo.fnote2 === '2') {
      this.ticket.masterInfo.ma_cuahang_n = event;
    }
  }

  openSearchShopDialog() {
    const data = JSON.parse(localStorage.getItem('shop') || "[]");
    this.commonService.openDialog(SearchDialogComponent, { dataSource: data, componentName: SEARCH_COMPONENT_NAME.SHOP_INFO })
      .afterClosed().subscribe(result => {
        this.ticket.masterInfo.ma_cuahang_n = result?.ma_cuahang;
        this.ticket.masterInfo.ten_cuahang_n = result?.ten_cuahang;
      });
  }

  openImportInventorySearchDialog() {
    let data = this.stock.filter(e => e.ma_cuahang === this.ticket.masterInfo.ma_cuahang_n);

    if (this.ma_loai === "HH") {
      data = data.filter(e => e.ma_loai === "HD");
    }
    else if (this.ma_loai === "HL") {
      data = data.filter(e => e.ma_loai === "BH");
    }
    else if (this.ma_loai === "BH") {
      data = data.filter(e => e.ma_loai === "HL");
    }

    this.commonService.openDialog(SearchDialogComponent, { dataSource: data, componentName: SEARCH_COMPONENT_NAME.STOCK_TRANSFER_FROM_SHOP })
      .afterClosed().subscribe(result => {
        this.ticket.masterInfo.ma_khon = result?.ma_kho;
        this.ticket.masterInfo.ten_khon = result?.ten_kho;
      });
  }

  openExportInventorySearchDialog() {
    const data = this.stock.filter(e => e.ma_cuahang === this.ticket.masterInfo.ma_cuahang);
    this.commonService.openDialog(SearchDialogComponent,
      { dataSource: data, componentName: SEARCH_COMPONENT_NAME.STOCK_TRANSFER_FROM_SHOP })
      .afterClosed().subscribe(result => {
        this.ticket.masterInfo.ma_kho = result?.ma_kho;
        this.ticket.masterInfo.ten_kho = result?.ten_kho;
        this.ma_loai = result.ma_loai;
      });
  }
  // #endregion master info

  // #region imei
  handleAddImei(merchandiseResponse: any) {
    const isExistImei = this.ticket.merchandise.find(e => e.ma_imei.includes(merchandiseResponse.ma_imei))
    if (isExistImei) {
      this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: merchandiseResponse.ma_imei });
      return;
    }

    const merchandise = this.ticket.merchandise.find(e => e.ma_vt === merchandiseResponse.ma_vt);
    if (merchandise) {
      merchandise.ma_imei += `,${merchandiseResponse.ma_imei}`;
      merchandise.so_luong = merchandise.ma_imei.split(",").length;
    }
    else {
      this.merchandiseService.addNew(merchandiseResponse, this.ticket.merchandise, Merchandise);
    }
  }

  onEnterImeiCode(ma_imei: string) {
    this.imeiService.getListImeiInfo([ma_imei]).subscribe((result) => {
      if (result.success && result.result.length) {
        result.result.map(merchandise => {
          if (merchandise.in_store_yn &&
            merchandise.exists_yn &&
            !merchandise.dieu_chuyen_yn &&
            !merchandise.dat_hang_yn &&
            !merchandise.ban_hang_yn &&
            !merchandise.bao_hanh_yn) {
            this.handleAddImei(merchandise);
          }
          else {
            this.commonService.showMessage("Trạng thái của imei không hợp lệ");
          }
        })
      }
      else {
        this.commonService.showMessageByNameAdvance(result.message, { name: '%imei', value: ma_imei });
      }
    })
    this.commonService.focusControl(this.tabIndex.imei);
  }

  onClickCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      result && this.onEnterImeiCode(result);
    });
  }

  onOpenInputImeiModal(event?: { item: any }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '800px';
    dialogConfig.height = '650px';
    dialogConfig.data = { item: event?.item }
    const dialogRef = this.dialog.open(ImportImeiComponent, dialogConfig);
    dialogRef.afterClosed()
      .subscribe(result => {
        result.map((item: any) => {
          this.handleAddImei(item)
        })
      });
  }

  // #endregion imei

  // #region merchandise
  openMerchandiseDialog(ma_vt?: string) {
    this.commonService.openDialog(SearchDialogComponent, {
      keyword: ma_vt || '',
      componentName: SEARCH_COMPONENT_NAME.MERCHANDISE,
      ma_ct: this.ticket.masterInfo.ma_ct
    }, 'search-style-dialog')
      .afterClosed().subscribe(result => {
        if (result && result.ma_imei) {
          this.onEnterImeiCode(result.ma_imei);
        }
      });
  }

  onEnterMerchandiseCode(ma_vt: string) {
    this.openMerchandiseDialog(ma_vt);
  }

  onRemoveMerchandise(event: { item: Merchandise }) {
    this.handleRemoveMerchandise(event.item);
  }

  handleRemoveMerchandise(merchandise: Merchandise) {
    this.stockTransferService.removeMerchandise(merchandise);
  }
  // #endregion merchandise



  // Submit
  onSave() {
    const message = this.stockTransferService.validateTicket(this.ticket);
    this.invalid = this.stockTransferService.isInvalidForm(this.ticket.masterInfo);

    //check valid các trường số lượng và tiền trong grid hàng hóa và dịch vụ
    if (!this.stockTransferService.isInvalidMerchandise(this.ticket.merchandise)) {
      this.commonService.showMessage(Language.content.grid_merchandise_invalid);
      return;
    }

    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      this.ticket.masterInfo.fnote2 = this.ticket.masterInfo.fnote2;
      const voucherDto = this.stockTransferService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.ticketApiService.updateVoucher(STOCK_TRANSFER_TICKET_ENTITY, voucherDto).subscribe(result => {
            this.isSaving = false;
            if (result.success) {
              this.commonService.showMessage(Language.content.Update_Completed);
              if (this.ticket.masterInfo.status == '2') {
                this.commonService.sendEmailService(this.ticket.masterInfo.stt_rec).subscribe((res) => {
                  if (res.success) {
                    this.commonService.showMessageByName(res.message);
                  }
                  this.router.navigate(['voucher/stock-tranfer-from-shop']);
                });
              }
              else {
                this.router.navigate(['voucher/stock-tranfer-from-shop']);
              }
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
          this.ticketApiService.addNewVoucher(STOCK_TRANSFER_TICKET_ENTITY, voucherDto).subscribe(result => {
            this.isSaving = false;
            if (result.success) {
              this.commonService.showMessage(Language.content.Successful_Create);
              this.router.navigate(['voucher/stock-tranfer-from-shop']);
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
    this.router.navigate(['sales/retail']);
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

}


