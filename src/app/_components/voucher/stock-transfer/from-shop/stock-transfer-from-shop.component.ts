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
import { StockTransferService } from './stock-transfer-from-shop.service';
import { STATUS, STOCK_TRANSFER_TICKET_CODE, STOCK_TRANSFER_TICKET_ENTITY } from './model/constants';
import { ImportImeiComponent } from '../import-imei/import-imei.component';
import { IMEIService } from '@app/_services/imei.service';

import { Customer } from '@app/_components/category/customer/customer.model';
import { DeliveryEmployeeApiService } from '@app/sales-management/api/delivery-employee-api.service';

const {
  MERCHANDISE_LIST
} = require('@assets/fields/grid/voucher-stock-transfer-from-shop.json');

@Component({
  selector: 'app-retail',
  templateUrl: './stock-transfer-from-shop.component.html',
  styleUrls: ['./stock-transfer-from-shop.component.scss'],
})
export class StockTransferFromShopComponent implements OnInit, AfterViewInit {
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
    ma_kho: 2,
    ma_khon: 3,
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
      label: "2-Chuyển hàng về kho tổng",
      value: 2
    }
  ]
  kho_nhap_datasource = [];
  kho_xuat_datasource = [];
  ma_loai = "";
  stocks: any[] = JSON.parse(localStorage.getItem('stock') || "[]");
  shops = JSON.parse(localStorage.getItem('shop') || "[]");

  ten_nvvc = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stockTransferService: StockTransferService,
    public dialog: MatDialog,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private imeiService: IMEIService,
    private deliveryEmployeeApiService: DeliveryEmployeeApiService
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

            //Hiển thị tên nhân viên vận chuyển
            this.onEnterDECode(this.ticket.masterInfo.fcode3);
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
  onChangeTransactionType(event: any) {
    this.ticket.masterInfo.fnote2 = event
    if (event === "1") {
      this.ticket.masterInfo.ma_cuahang_n = this.ticket.masterInfo.ma_cuahang;
      this.ticket.masterInfo.ten_cuahang_n = this.ticket.masterInfo.ten_cuahang;
      this.ticket.masterInfo.ma_khon = '';
      this.ticket.masterInfo.ten_khon = '';
    }
    if (event === "2") {
      this.ticket.masterInfo.ma_cuahang_n = '';
      this.ticket.masterInfo.ten_cuahang_n = '';
    }
  }

  onChangeImportStore(event: any) {
    if (this.ticket.masterInfo.fnote2 === '2') {
      this.ticket.masterInfo.ma_cuahang_n = event.trim();
      const shop = this.shops.find((e: any) => (e.ma_cuahang as string).toUpperCase() === (event as string).trim().toUpperCase())
      if (shop) {
        this.ticket.masterInfo.ma_cuahang_n = shop.ma_cuahang;
        this.ticket.masterInfo.ten_cuahang_n = shop.ten_cuahang;
      }
    }
    else if (this.ticket.masterInfo.fnote2 === '1') {

    }
  }

  openSearchShopDialog() {
    let data = this.shops;
    if (this.ticket.masterInfo.fnote2 === '2') {
      data = this.shops.filter((x: { ma_cuahang: string; }) => {
        const ma_cuahang = x.ma_cuahang.trim().toUpperCase();
        return ma_cuahang === 'HN000' || ma_cuahang === 'SG000' || ma_cuahang === 'HN008'
      });
    }
    this.commonService.openDialog(SearchDialogComponent, { dataSource: data, componentName: SEARCH_COMPONENT_NAME.SHOP_INFO })
      .afterClosed().subscribe(result => {
        this.ticket.masterInfo.ma_cuahang_n = result?.ma_cuahang;
        this.ticket.masterInfo.ten_cuahang_n = result?.ten_cuahang;
      });
  }

  openImportInventorySearchDialog() {
    let ma_loai = this.ma_loai;
    if (this.ma_loai === "HH") {
      ma_loai = "HD";
    }
    else if (this.ma_loai === "HD") {
      ma_loai = "HH";
    }
    else if (this.ma_loai === "HL") {
      ma_loai = "BH";
    }
    else if (this.ma_loai === "BH") {
      ma_loai = "HL";
    }
    else {
      ma_loai = '';
    }

    let filter: any[] = [];
    if (ma_loai !== '') {
      filter = [{
        name: 'ma_loai',
        operator: "=",
        value: ma_loai
      },
      {
        name: 'ma_cuahang',
        operator: "=",
        value: this.ticket.masterInfo.ma_cuahang_n
      }
      ]
    }
    else {
      filter = [
        {
          name: 'ma_cuahang',
          operator: "=",
          value: this.ticket.masterInfo.ma_cuahang_n
        },
        {
          name: 'ma_loai',
          operator: "<>",
          value: 'HH'
        },
        {
          name: 'ma_loai',
          operator: "<>",
          value: 'HD'
        }
      ]

      if (this.ticket.masterInfo.fnote2 === '2')
        filter = [
          {
            name: 'ma_cuahang',
            operator: "=",
            value: this.ticket.masterInfo.ma_cuahang_n
          },
          {
            name: 'ma_loai',
            operator: "=",
            value: 'HH'
          }
        ]
    }

    this.commonService.openDialog(SearchDialogComponent, { filter, componentName: SEARCH_COMPONENT_NAME.STOCK_INFO })
      .afterClosed().subscribe(result => {
        this.ticket.masterInfo.ma_khon = result?.ma_kho;
        this.ticket.masterInfo.ten_khon = result?.ten_kho;
      });
  }

  onChangeValueImportInventoryCode(event: any) {
    const stockOutFilter = [{
      name: 'ma_kho',
      operator: "=",
      value: this.ticket.masterInfo.ma_kho
    }
    ]

    this.ticketApiService.findStocks(stockOutFilter, 1, 1).subscribe(result => {
      if (result.success && result.result.items) {
        if (!result?.result.items[0]) {
          this.commonService.showMessage("Chưa nhập mã kho xuất");
          this.commonService.focusControl(this.tabIndex.ma_kho);
          return;
        }
        else {
          const _stock_out = result?.result.items[0];

          const stockInFilter = [
            {
              name: 'ma_kho',
              operator: "=",
              value: (event as string).trim()
            },
            {
              name: 'ma_cuahang',
              operator: "=",
              value: this.ticket.masterInfo.ma_cuahang_n
            }
          ]

          this.ticketApiService.findStocks(stockInFilter, 1, 1).subscribe(result => {
            if (result.success && result.result?.items[0]) {
              const _stock = result?.result.items[0];

              const ma_loai_out = _stock_out.ma_loai.trim().toUpperCase();
              const ma_loai_in = _stock.ma_loai.trim().toUpperCase();

              //loại kho xuất là HH -> loại kho nhận phải là HH hoặc HD
              if (ma_loai_out === 'HH' && ma_loai_in !== 'HH' && ma_loai_in !== 'HD') {
                this.commonService.showMessage("Mã kho xuất loại HH thì mã kho nhận phải là loại HH hoặc HD");
                this.ticket.masterInfo.ma_khon = '';
                this.ticket.masterInfo.ten_khon = '';
                return;
              }

              //loại kho xuất là BH -> loại kho nhận phải là HL
              if (ma_loai_out === 'BH' && ma_loai_in !== 'HL') {
                this.commonService.showMessage("Mã kho xuất loại BH thì mã kho nhận phải là loại HL");
                this.ticket.masterInfo.ma_khon = '';
                this.ticket.masterInfo.ten_khon = '';
                return;
              }

              //loại kho xuất là HL -> loại kho nhận phải là BH
              if (ma_loai_out === 'HL' && ma_loai_in !== 'BH') {
                this.commonService.showMessage("Mã kho xuất loại HL thì mã kho nhận phải là loại BH");
                this.ticket.masterInfo.ma_khon = '';
                this.ticket.masterInfo.ten_khon = '';
                return;
              }

              this.ticket.masterInfo.ma_khon = _stock.ma_kho;
              this.ticket.masterInfo.ten_khon = _stock.ten_kho;
            }
            else {
              this.commonService.showMessage("Không tìm thấy kho " + event)
            }
          })
        }
      }
    });
  }

  openExportInventorySearchDialog() {
    const filter = [{
      name: 'ma_cuahang',
      operator: "=",
      value: this.ticket.masterInfo.ma_cuahang
    }]
    this.commonService.openDialog(SearchDialogComponent,
      { filter, componentName: SEARCH_COMPONENT_NAME.STOCK_INFO })
      .afterClosed().subscribe(result => {
        this.ticket.masterInfo.ma_kho = result?.ma_kho;
        this.ticket.masterInfo.ten_kho = result?.ten_kho;
        this.ma_loai = result.ma_loai;
      });
  }

  onChangeValueExportInventoryCode(event: any) {
    const filter = [{
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
    this.ticketApiService.findStocks(filter, 1, 1).subscribe(result => {
      if (result.success && result.result.items) {
        this.ticket.masterInfo.ma_kho = result?.result.items[0]?.ma_kho;
        this.ticket.masterInfo.ten_kho = result?.result.items[0]?.ten_kho;
      }
      else {
        this.ticket.masterInfo.ten_kho = '';
        this.commonService.showMessage(`Không tìm thấy kho ${event.trim()}`);
      }
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
    if (!this.ticket.masterInfo.ma_kho || this.ticket.masterInfo.ma_kho === '') {
      this.commonService.showMessage("Chưa nhập mã kho xuất");
      this.commonService.focusControl(this.tabIndex.ma_kho);
      return;
    }
    if (!this.ticket.masterInfo.ma_khon || this.ticket.masterInfo.ma_khon === '') {
      this.commonService.showMessage("Chưa nhập mã kho nhập");
      this.commonService.focusControl(this.tabIndex.ma_khon);
      return;
    }

    this.imeiService.getListImeiInfo([ma_imei], this.ticket.masterInfo.ma_kho).subscribe((result) => {
      if (result.success && result.result.length) {
        result.result.map(merchandise => {
          if (!merchandise.exists_yn) {
            this.commonService.showMessage("Mã imei không tồn tại trong hệ thống");
            this.commonService.focusControl(this.tabIndex.imei);
            return;
          }
          if (!merchandise.in_store_yn || !merchandise.in_stock_yn) {
            this.commonService.showMessage("Mã imei không tồn kho tại kho xuất hoặc không có trong cửa hàng");
            this.commonService.focusControl(this.tabIndex.imei);
            return;
          }

          if (!merchandise.dieu_chuyen_yn &&
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
    dialogConfig.data = { item: event?.item, ma_kho: this.ticket.masterInfo.ma_kho }
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

    //check mã kho xuất thuộc mã cửa hàng xuất
    const stock_out = this.stocks.find(x => x.ma_kho.trim().toUpperCase() === this.ticket.masterInfo.ma_kho.trim().toUpperCase());
    if (!stock_out) {
      this.commonService.showMessage('Không tìm thấy thông tin kho xuất trong danh mục kho');
      return;
    }
    if (stock_out.ma_cuahang.trim().toUpperCase() !== this.ticket.masterInfo.ma_cuahang.trim().toUpperCase()) {
      this.commonService.showMessage('Mã kho xuất không thuộc cửa hàng xuất');
      return;
    }

    //check mã kho xuất thuộc mã cửa hàng xuất
    const stock_in = this.stocks.find(x => x.ma_kho.trim().toUpperCase() === this.ticket.masterInfo.ma_khon.trim().toUpperCase());
    if (!stock_in) {
      this.commonService.showMessage('Không tìm thấy thông tin kho nhập trong danh mục kho');
      return;
    }
    if (stock_in.ma_cuahang.trim().toUpperCase() !== this.ticket.masterInfo.ma_cuahang_n.trim().toUpperCase()) {
      this.commonService.showMessage('Mã kho nhập không thuộc cửa hàng nhập');
      return;
    }

    //check giao dịch 2: cửa hàng nhận phải là 1 trong các shop id sau HN000, SG000, HN008
    // (tạm fix cứng do cần dùng gấp => sẽ bổ sung vào khai báo trong danh mục ở db sau)
    if (this.ticket.masterInfo.fnote2 === '2') {
      const store_in = this.ticket.masterInfo.ma_cuahang_n;
      if (!store_in || store_in === '') {
        this.commonService.showMessage('Chưa nhập cửa hàng nhận');
        return;
      }
      if (store_in.trim().toUpperCase() !== 'HN000' && store_in.trim().toUpperCase() !== 'SG000'
        && store_in.trim().toUpperCase() !== 'HN008') {
        this.commonService.showMessage('Giao dịch chuyển hàng về kho tổng, cửa hàng nhận phải là 1 trong các mã sau: HN000, SG000, HN008');
        return;
      }
    }

    //check valid các trường số lượng và tiền trong grid hàng hóa và dịch vụ
    if (!this.stockTransferService.isInvalidMerchandise(this.ticket.merchandise)) {
      this.commonService.showMessage(Language.content.grid_merchandise_invalid);
      return;
    }
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      //cập nhật tổng số lượng
      this.ticket.masterInfo.t_so_luong = this.ticket.merchandise.reduce((total, currentValue) => {
        return total + currentValue.so_luong;
      }, 0);


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
    this.router.navigate(['voucher/stock-tranfer-from-shop']);
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  onOpenDialogTransport() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.DELIVERY_EMP, title: 'Danh sách đơn vị vận chuyển' }, 'search-style-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        if (customer) {
          this.ticket.masterInfo.fcode3 = customer.ma_kh;
          this.ten_nvvc = customer.ten_kh;
        }
      })
  }

  onEnterDECode(ma_nvvc: string) {
    if (!ma_nvvc) {
      this.ticket.masterInfo.fcode3 = '';
      this.ten_nvvc = '';
      return;
    }
    this.deliveryEmployeeApiService.getOneById(ma_nvvc).subscribe(result => {
      if (result.success && result.result) {
        this.handleAddDeliveryEmpl((result.result as any));
      } else {
        this.commonService.showMessage(Language.content.Staff_not_exist);
      }
    });
  }

  handleAddDeliveryEmpl(empl: any) {
    this.ticket.masterInfo.fcode3 = empl.ma_kh;
    this.ten_nvvc = empl.ten_kh;
  }

}


