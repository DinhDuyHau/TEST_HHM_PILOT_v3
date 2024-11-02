import { Component } from '@angular/core';
import { Merchandise, StockShopCheckTicket } from './model/model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import dataFormat from '@app/_common/dataFormat';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { StatusTicket } from '@app/_models';
import { IMEIService } from '@app/_services/imei.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { SearchDialogComponent, SEARCH_COMPONENT_NAME } from '@app/sales-management/component/search/serach-dialog.component';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { Language } from '@app/sales-management/page/common/language';
import { MerchandiseService } from '@app/sales-management/page/common/merchandise.service';
import { MODE } from '../enum/voucher_enum';
import { ImportImeiComponent, ImportImeiTypeEnum } from '../stock-transfer/import-imei/import-imei.component';
import { STOCK_SHOP_CHECK_TICKET_ENTITY, STOCK_SHOP_CHECK_TICKET_CODE, STATUS } from './model/constants';
import { StockShopCheckService } from './stock-shop-check.service';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';

const {
  MERCHANDISE_LIST
} = require('@assets/fields/grid/voucher-stock-shop-check.json');

@Component({
  selector: 'app-stock-shop-check',
  templateUrl: './stock-shop-check.component.html',
  styleUrls: ['./stock-shop-check.component.scss']
})
export class StockShopCheckComponent {
  ticket: StockShopCheckTicket = new StockShopCheckTicket;
  statusList: StatusTicket[] = [];
  dataFormat = dataFormat;
  title = '';
  merchandiseColumns = MERCHANDISE_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  isDisabled = false;
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
  entity = STOCK_SHOP_CHECK_TICKET_ENTITY;
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
  stocks: any[] = JSON.parse(localStorage.getItem('stock') || "[]");
  shops = JSON.parse(localStorage.getItem('shop') || "[]");

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stockShopCheckService: StockShopCheckService,
    public dialog: MatDialog,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private imeiService: IMEIService
  ) {
    localStorage.setItem('useGridCached', '1');
    this.stockShopCheckService.setTicket(this.ticket, this.option);
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: STOCK_SHOP_CHECK_TICKET_CODE }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.pipe().subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(STOCK_SHOP_CHECK_TICKET_ENTITY, data.key).subscribe((result) => {
          if (result.result) {
            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS.CREATE) {
              this.router.navigate(['/404']);
            }
            this.stockShopCheckService.loadData(result.result as any as VoucherDto);
            this.list_imei_old = this.ticket.merchandise.map(x => x.ma_imei);
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
            getStatusList();
            this.tabIndexFocusFirst = this.tabIndex.imei;
          }
        });
      } else {
        this.stockShopCheckService.initTicket(this.ticket);
        getStatusList();
        this.tabIndexFocusFirst = this.tabIndex.imei;
      }
    });
  }

  // #region master info
  openInventorySearchDialog() {
    let data = this.stocks.filter(e => e.ma_cuahang === this.ticket.masterInfo.ma_cuahang);
    let ma_loai = this.ma_loai;
    if (this.ma_loai === "HH") {
      ma_loai === "HD";
    }
    else if (this.ma_loai === "HL") {
      ma_loai === "BH";
    }
    else if (this.ma_loai === "BH") {
      ma_loai === "HL";
    }

    const filter = [{
      name: 'ma_loai',
      operator: "=",
      value: ma_loai
    },
    {
      name: 'ma_cuahang',
      operator: "=",
      value: this.ticket.masterInfo.ma_cuahang
    }
    ]

    this.commonService.openDialog(SearchDialogComponent, { filter, componentName: SEARCH_COMPONENT_NAME.STOCK_INFO })
      .afterClosed().subscribe(result => {
        this.ticket.masterInfo.ma_kho = result?.ma_kho;
        this.ticket.masterInfo.ten_kho = result?.ten_kho;
      });
  }

  onChangeValueInventoryCode(event: any) {
    const stockInFilter = [
      {
        name: 'ma_kho',
        operator: "=",
        value: (event as string).trim()
      },
      {
        name: 'ma_cuahang',
        operator: "=",
        value: this.ticket.masterInfo.ma_cuahang
      }
    ]

    this.ticketApiService.findStocks(stockInFilter, 1, 1).subscribe(result => {
      if (result.success && result.result?.items[0]) {
        const _stock = result?.result?.items[0];
        this.ticket.masterInfo.ma_kho = _stock?.ma_kho;
        this.ticket.masterInfo.ten_kho = _stock?.ten_kho;
      }
      else {
        this.commonService.showMessage("Không tìm thấy kho " + event)
      }
    })
  }

  openEmployeeSearchDialog(type: string) {
    this.commonService.openDialog(SearchDialogComponent, { dataSource: [], componentName: SEARCH_COMPONENT_NAME.EMPLOYEE })
      .afterClosed().subscribe(result => {
        if (type === "2") {
          this.ticket.masterInfo.ma_nvkk02 = result?.ma_kh?.trim();
          this.ticket.masterInfo.ten_nvkk02 = result?.ten_kh?.trim();
        }
        else if (type == "3") {
          this.ticket.masterInfo.ma_nvkk03 = result?.ma_kh?.trim();
          this.ticket.masterInfo.ten_nvkk03 = result?.ten_kh?.trim();
        }
      });
  }
  // #endregion master info

  // #region imei
  handleAddImei(merchandiseResponse: any) {
    const isExistImei = this.ticket.merchandise.find(e => e.ma_imei?.includes(merchandiseResponse.ma_imei))
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
    this.imeiService.getListImeiInfo([ma_imei], this.ticket.masterInfo.ma_kho).subscribe((result) => {
      if (result.success && result.result.length) {
        result.result.map(merchandise => {
          this.handleAddImei(merchandise);
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
    dialogConfig.data = { item: event?.item, ma_kho: this.ticket.masterInfo.ma_kho, type: ImportImeiTypeEnum.STOCK_CHECK }
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
    this.stockShopCheckService.removeMerchandise(merchandise);
  }
  // #endregion merchandise



  // Submit
  onSave() {
    const message = this.stockShopCheckService.validateTicket(this.ticket);
    this.invalid = this.stockShopCheckService.isInvalidForm(this.ticket.masterInfo);

    //check valid các trường số lượng và tiền trong grid hàng hóa và dịch vụ
    if (!this.stockShopCheckService.isInvalidMerchandise(this.ticket.merchandise)) {
      this.commonService.showMessage(Language.content.grid_merchandise_invalid);
      return;
    }

    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.stockShopCheckService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        this.isDisabled = true;
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.ticketApiService.updateVoucher(STOCK_SHOP_CHECK_TICKET_ENTITY, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
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
          this.isDisabled = true;
          this.ticketApiService.addNewVoucher(STOCK_SHOP_CHECK_TICKET_ENTITY, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
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


