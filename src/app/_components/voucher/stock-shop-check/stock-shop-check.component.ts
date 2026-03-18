import { Component } from '@angular/core';
import { Merchandise, StockShopCheckTicket } from './model/model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import dataFormat from '@app/_common/dataFormat';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { StatusTicket } from '@app/_models';
import { IMEIService } from '@app/_services/imei.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
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
import { ViewChild } from '@angular/core';
import { TableCustomComponent } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.component';
import { ChangeDetectorRef } from '@angular/core';

const {
  MERCHANDISE_LIST
} = require('@assets/fields/grid/voucher-stock-shop-check.json');

@Component({
  selector: 'app-stock-shop-check',
  templateUrl: './stock-shop-check.component.html',
  styleUrls: ['./stock-shop-check.component.scss']
})
export class StockShopCheckComponent {
  @ViewChild(TableCustomComponent) tableCustom!: TableCustomComponent;
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
  isStockCheckDisabled = false;
  isItemInfoDisabled = false;
  isSaveAuto = false;
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
      label: "Phiếu nhập mua nhà cung cấp",
      value: "PNA"
    },
    {
      label: "Phiếu mua lại hàng",
      value: "MHA"
    },
    {
      label: "Phiếu nhập hàng bán trả lại",
      value: "HDF"
    },
    {
      label: "Phiếu nhập hoàn sàn TMĐT",
      value: "HDR"
    },
    {
      label: "Phiếu nhập thu hồi hàng cho mượn",
      value: "PNM"
    },
    {
      label: "Phiếu nhập bảo hành",
      value: "PNW"
    }
  ];
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
    private merchandiseApiService: MerchandiseApiService,
    private customerApiService: CustomerApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private imeiService: IMEIService,
    private cdr: ChangeDetectorRef
  ) {
    localStorage.setItem('useGridCached', '1');
    this.stockShopCheckService.setTicket(this.ticket, this.option);
  }

  private reIndexLineNbr(): void {
    this.ticket.merchandise = this.ticket.merchandise.map((item, index) => ({
      ...item,
      line_nbr: index + 1
    }));
  }

  // sắp xếp hàng hóa theo kết quả Thừa -> Thiếu -> Đủ
  private sortMerchandiseByResult(): void {
    const order: Record<string, number> = { '2': 0, '1': 1, '0': 2 };
    this.ticket.merchandise = [...this.ticket.merchandise].sort(
      (a, b) => (order[a.kq_kk] ?? 99) - (order[b.kq_kk] ?? 99)
    );
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
            this.isStockCheckDisabled = true;
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



    if (this.mode == MODE.CREATE) {
      this.ticketApiService.getStocktakingTransactionType([{ Name: 'ma_gd', Operator: '=', Value: '01' }], 1, 1).subscribe(result => {
        if (result.success && result.result?.items[0]) {
          const _stocktakingTransactionType = result?.result?.items[0];
          this.ticket.masterInfo.ma_gd = _stocktakingTransactionType?.ma_gd;
          this.ticket.masterInfo.ten_gd = _stocktakingTransactionType?.ten_gd;
        }
      });
    }

    this.route.queryParams.pipe().subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(STOCK_SHOP_CHECK_TICKET_ENTITY, data.key).subscribe((result) => {
          if (result.result) {
            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS.CREATE) {
              this.router.navigate(['/404']);
            }
            this.stockShopCheckService.loadData(result.result as any as VoucherDto);
            this.sortMerchandiseByResult();
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
    this.commonService.openDialog(SearchDialogComponent, { componentName: SEARCH_COMPONENT_NAME.STOCKTAKING_TRANSACTION_TYPE })
      .afterClosed().subscribe(result => {
        this.ticket.masterInfo.ma_gd = result?.ma_gd;
        this.ticket.masterInfo.ten_gd = result?.ten_gd;

        if (this.ticket.masterInfo.ma_gd == '02') {
          this.isItemInfoDisabled = true;
          this.ticket.masterInfo.nh_vt1 = '';
          this.ticket.masterInfo.nh_vt2 = '';
          this.ticket.masterInfo.nh_vt3 = '';
          this.ticket.masterInfo.nh_vt4 = '';
          this.ticket.masterInfo.ma_vt = '';
          this.ticket.masterInfo.ten_vt = '';
        }
        else { this.isItemInfoDisabled = false; }
      });
  }

  onChangeValueInventoryCode(event: any) {
    const stocktakingTransactionTypeFilter = [
      {
        name: 'ma_gd',
        operator: "=",
        value: (event as string).trim()
      }
    ]

    this.ticketApiService.getStocktakingTransactionType(stocktakingTransactionTypeFilter, 1, 1).subscribe(result => {
      if (result.success && result.result?.items[0]) {
        const _stocktakingTransactionType = result?.result?.items[0];
        this.ticket.masterInfo.ma_gd = _stocktakingTransactionType?.ma_gd;
        this.ticket.masterInfo.ten_gd = _stocktakingTransactionType?.ten_gd;
      }
      else {
        this.commonService.showMessage("Không tìm thấy loại giao dịch kiểm kê " + event)
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

  openItemListDialog(nh_vt1?: string, nh_vt2?: string, nh_vt3?: string) {
    const filter = [
      nh_vt1 && { name: 'nh_vt1', operator: '=', value: nh_vt1 },
      nh_vt2 && { name: 'nh_vt2', operator: '=', value: nh_vt2 },
      nh_vt3 && { name: 'nh_vt3', operator: '=', value: nh_vt3 },
    ].filter(Boolean);

    this.commonService.openDialog(SearchDialogComponent, { filter, componentName: SEARCH_COMPONENT_NAME.TYPE_MERCHANDISE })
      .afterClosed().subscribe(result => {
        this.ticket.masterInfo.ma_vt = result?.ma_vt;
        this.ticket.masterInfo.ten_vt = result?.ten_vt;
      });
  }
  openItemGroupSearchDialog(type: number) {
    this.commonService.openDialog(SearchDialogComponent, { keyword: type || '', componentName: SEARCH_COMPONENT_NAME.ITEM_GROUP })
      .afterClosed().subscribe(result => {
        if (!result?.ma_nh) return;

        switch (type) {
          case 1:
            this.ticket.masterInfo.nh_vt1 = result.ma_nh;
            break;
          case 2:
            this.ticket.masterInfo.nh_vt2 = result.ma_nh;
            break;
          case 3:
            this.ticket.masterInfo.nh_vt3 = result.ma_nh;
            break;
          case 4:
            this.ticket.masterInfo.nh_vt4 = result.ma_nh;
            break;
        }
      });
  }

  onChangeItemGroup(event: any, group: number) {
    switch (group) {
      case 1:
        this.ticket.masterInfo.nh_vt1 = event;
        break;
      case 2:
        this.ticket.masterInfo.nh_vt2 = event;
        break;
      case 3:
        this.ticket.masterInfo.nh_vt3 = event;
        break;
      case 4:
        this.ticket.masterInfo.nh_vt4 = event;
        break;
    }
  }

  onChangeItem(event: any) {
    this.ticket.masterInfo.ma_vt = event;
  }
  onEnterItemCode(event: any) {
    this.merchandiseApiService.getMany([{ Name: 'ma_vt', Operator: '=', Value: event }]).subscribe(result => {
      if (result.success && result.result?.items[0]) {
        this.ticket.masterInfo.ma_vt = result.result?.items[0].ma_vt;
        this.ticket.masterInfo.ten_vt = result.result?.items[0].ten_vt;
      }
    });
  }

  onClickCheckInventory() {
    if (this.ticket.merchandise && this.ticket.merchandise.length > 0) {
      const isContinue = confirm("Thông tin hàng hóa sẽ bị xóa. Bạn có muốn tiếp tục không?");
      if (isContinue)
        this.ticket.merchandise = []
      else
        return
    }
    if (!this.ticket.masterInfo.ma_gd) {
      this.commonService.showMessage("Mã giao dịch không được để trống.");
      return;
    }
    else {
      this.isSaving = true;

      const body: any = {
        tu_ngay: "2025-03-01",
        den_ngay: new Date(this.ticket.masterInfo.ngay_ct),
        ma_cuahang: this.ticket.masterInfo.ma_cuahang,
        ma_vt: this.ticket.masterInfo.ma_vt,
        nh_vt1: this.ticket.masterInfo.nh_vt1,
        nh_vt2: this.ticket.masterInfo.nh_vt2,
        nh_vt3: this.ticket.masterInfo.nh_vt3,
        nh_vt4: this.ticket.masterInfo.nh_vt4,
        reset: true,
        page_index: 1,
        page_size: 500000
      };

      this.ticketApiService.getStockBalance(body).subscribe(res => {
        if (res) {
          this.ticket.masterInfo.t_so_luong = res.result.recordCount - 1;
          this.ticket.merchandise = res.result.items
            .filter((item: any) => item.sysorder == 5) // lọc sysorder = 5
            .map((item: any) => ({
              ...item,
              line_nbr: item.stt,          // số thứ tự
              ma_kho: item.ma_kho,         // mã kho
              nguon_kk: '0',               // thêm trường mới
              ten_nguon_kk: 'Đổ tồn',      // tên nguồn kiểm kê
              ma_vt: item.ma_vt,           // mã vật tư
              ten_vt: item.ten_vt,         // tên vật tư
              dvt: item.dvt,               // đơn vị tính
              so_luong: item.so_luong,     // số lượng
              ma_imei: item.ma_imei,       // mã imei
              ma_imei_tt: '',              // imei thực tế (chưa nhập)
              so_luong_tt: 0,              // số lượng thực tế (mặc định 0)
              kq_kk: '1',                  // thêm trường mới
              ten_kq_kk: 'Thiếu',          // tên kết quả kiểm kê
              ghi_chu: ''                  // ghi chú
            }));
          this.isSaveAuto = true;
          this.onSave()

        }
        else {
          this.commonService.showMessage("Không tìm thấy dữ liệu tồn kho.");
          return;
        }
      });
    }
  }

  // #endregion master info

  // #region imei
  handleAddImei(merchandiseResponse: any): void {

    if (!merchandiseResponse?.ma_imei) return;

    // 1️⃣ Kiểm tra IMEI đã tồn tại trong danh sách kiểm kê chưa
    const isExistImei = this.ticket.merchandise.some(
      e => e.ma_imei_tt === merchandiseResponse.ma_imei
    );

    if (isExistImei) {
      this.commonService.showMessageByNameAdvance(
        'lblWarningExistImeiDetail',
        { name: '%imei', value: merchandiseResponse.ma_imei }
      );
      return;
    }

    // Kiểm tra đã tồn tại dòng hàng hóa theo ma_imei chưa
    const index = this.ticket.merchandise.findIndex(
      e => e.ma_imei === merchandiseResponse.ma_imei
    );

    // =============================
    // Nếu đã có dòng hàng hóa
    // =============================
    if (index !== -1) {

      const updatedItem = {
        ...this.ticket.merchandise[index],
        ma_imei_tt: merchandiseResponse.ma_imei,
        so_luong_tt: 1,
        kq_kk: '0',
        ten_kq_kk: 'Đủ'
      };

      // Tạo mảng mới để Angular detect change
      this.ticket.merchandise = [
        ...this.ticket.merchandise.slice(0, index),
        updatedItem,
        ...this.ticket.merchandise.slice(index + 1)
      ];

      const master = this.ticket.masterInfo;
      // tăng số lượng thực tế
      const new_sl_thuc_te = (master.t_sl_thuc_te || 0) + 1;
      // tính chênh lệch
      const new_chenh_lech = new_sl_thuc_te - (master.t_so_luong || 0);
      // cập nhật master
      this.ticket.masterInfo = {
        ...master,
        t_sl_thuc_te: new_sl_thuc_te,
        t_chenh_lech: new_chenh_lech
      };

    }
    // =============================
    // Nếu chưa có thì thêm mới
    // =============================
    else {

      const newItem = new Merchandise({
        ma_vt: merchandiseResponse.ma_vt,
        ten_vt: merchandiseResponse.ten_vt,
        dvt: merchandiseResponse.dvt,
        ma_imei_tt: merchandiseResponse.ma_imei,
        so_luong_tt: 1,
        nguon_kk: '1',
        ten_nguon_kk: 'Nhập trong lúc kiểm kê',
        kq_kk: '2',
        ten_kq_kk: 'Thừa'
      });

      // Tạo mảng mới
      this.ticket.merchandise = [
        ...this.ticket.merchandise,
        newItem
      ];

      const master = this.ticket.masterInfo;
      // tăng số lượng thực tế
      const new_sl_thuc_te = (master.t_sl_thuc_te || 0) + 1;
      // tính chênh lệch
      const new_chenh_lech = new_sl_thuc_te - (master.t_so_luong || 0);
      // cập nhật master
      this.ticket.masterInfo = {
        ...master,
        t_sl_thuc_te: new_sl_thuc_te,
        t_chenh_lech: new_chenh_lech
      };
    }
    this.reIndexLineNbr();
    this.sortMerchandiseByResult();
  }

  onClickCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      result && this.onEnterImeiCode(result);
    });
  }
  onEnterImeiCode(ma_imei_tt: string) {
    this.imeiService
      .getListImeiInfo([ma_imei_tt], this.ticket.masterInfo.ma_kho)
      .subscribe((result) => {

        if (result.success && result.result.length) {

          // Thêm / cập nhật IMEI trước
          result.result.forEach(merchandise => {
            this.handleAddImei(merchandise);
          });

          // Đợi Angular render xong rồi mới focus
          setTimeout(() => {
            const lastImei =
              result.result[result.result.length - 1]?.ma_imei;

            if (lastImei) {
              this.tableCustom.selectRowByImei(lastImei);
            }
          });

        } else {
          this.commonService.showMessageByNameAdvance(
            result.message,
            { name: '%imei', value: ma_imei_tt }
          );
        }
      });

    this.commonService.focusControl(this.tabIndex.imei);
  }

  onEnterImeiCode2(ma_imei_xuat: string) {
    const foundItem = this.ticket.merchandise.find(
      (item: any) => item.ma_imei === ma_imei_xuat
    );

    if (!foundItem) {
      this.commonService.showMessage("Không tìm thấy dữ liệu trong danh sách kiểm kê.");
    } else {
      // Cập nhật bản ghi
      foundItem.ma_imei_tt = ma_imei_xuat;
      foundItem.so_luong_tt = 1;
      foundItem.kq_kk = '0';
      foundItem.ten_kq_kk = 'Đủ';
      foundItem.ghi_chu = "Xuất trong lúc kiểm kê";
    }
  }

  onClickImeiImportVoucher() {
    if (!this.ticket.masterInfo.so_ct_pn || !this.ticket.masterInfo.loai_gd_n) {
      this.commonService.showMessage("Số phiếu nhập và loại giao dịch nhập bắt buộc phải nhập.");
    }
    else {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const req = {
        ma_ct: this.ticket.masterInfo.loai_gd_n,
        so_ct: this.ticket.masterInfo.so_ct_pn,
        ma_gd: this.ticket.masterInfo.ma_gd,

        nh_vt1: this.ticket.masterInfo.nh_vt1,
        nh_vt2: this.ticket.masterInfo.nh_vt2,
        nh_vt3: this.ticket.masterInfo.nh_vt3,
        nh_vt4: this.ticket.masterInfo.nh_vt4,
        ma_vt: this.ticket.masterInfo.ma_vt,
        ma_cuahang: user.shop
      };

      this.imeiService.getImeiFromImportVoucher(req)
        .subscribe(res => {

          if (!res.success) return;
          const option = this.transactionTypeOptions.find(
            x => x.value === this.ticket.masterInfo.loai_gd_n
          );
          res.data.forEach((item: any) => {
            this.ticket.merchandise.push({
              ...item,
              // ma_imei_tt: item.ma_imei,
              so_luong: 1,
              so_luong_tt: 1,
              nguon_kk: '1',
              ten_nguon_kk: 'Nhập trong lúc kiểm kê',
              kq_kk: '2',
              ten_kq_kk: 'Thừa',
              ghi_chu: option?.label,
              // this.ticket.masterInfo.loai_gd_n,

              stt_rec_pn: item.stt_rec,
              stt_rec0pn: item.stt_rec0,
              so_ct_pn: item.so_ct,
              ngay_ct_pn: item.ngay_ct
            });

          });
          this.reIndexLineNbr();
          this.sortMerchandiseByResult();
        });
    }
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
    //this.invalid = this.stockShopCheckService.isInvalidForm(this.ticket.masterInfo);

    //check valid các trường số lượng và tiền trong grid hàng hóa và dịch vụ
    if (!this.stockShopCheckService.isInvalidMerchandise(this.ticket.merchandise)) {
      this.commonService.showMessage(Language.content.grid_merchandise_invalid);
      return;
    }

    // this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.stockShopCheckService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        this.isDisabled = true;
        if (this.mode === MODE.UPDATE) {
          this.isSaving = true;
          if (!this.ticket.masterInfo) {

          }
          this.ticketApiService.updateVoucher(STOCK_SHOP_CHECK_TICKET_ENTITY, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              this.commonService.showMessage(Language.content.Update_Completed);
              if (!this.isSaveAuto)
                this.router.navigate(['voucher/stock-shop-check']);
              this.isSaveAuto = false;
            } else {
              if (!this.isSaveAuto)
                this.commonService.handleResponseErrorVoucher(result, 'voucher/stock-shop-check');
              this.isSaveAuto = false;
            }
          });
        } else if (this.mode === MODE.CREATE) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.addNewVoucher(STOCK_SHOP_CHECK_TICKET_ENTITY, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              this.commonService.showMessage(Language.content.Successful_Create);
              if (!this.isSaveAuto)
                this.router.navigate(['voucher/stock-shop-check']);
              else {
                const queryParams = {} as any;
                queryParams.key = (result.result as any).stt_rec;
                this.router.navigate(['voucher/stock-shop-check/update'], { queryParams });
                this.isSaveAuto = false;
              }
            } else {
              if (!this.isSaveAuto)
                this.commonService.handleResponseErrorVoucher(result, 'voucher/stock-shop-check');
              this.isSaveAuto = false;
            }
          });
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['voucher/stock-shop-check']);
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

}