import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Button } from '@app/_components/grid/grid.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TICKET_TYPE } from '@app/sales-management/enum/ticket.enum';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { Cell } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.component';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { CommonService } from '../common/common.service';
import { AdvancedSearchDialogComponent } from '@app/sales-management/component/advanced-search/advanced-search-dialog.component';
import { GridService } from '@app/_components/gridV2/grid.service';
import { MenuReport } from '@app/_models';
import { DialogConfirmComponent } from '@app/_components/dialog/dialog-confirm/dialog-confirm.component';

const TICKET_FIELDS = require('@assets/fields/grid/sales-ticket.json')

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, OnChanges, AfterViewInit {
  buttonsCustom!: Button[];
  ticketType!: number;
  dataSource!: any[];
  columns!: Cell[];
  title!: string;
  entityName!: string;
  codeName!: string;
  primaryKey!: string;
  getDataMode = 0;
  hiddenPagination = false;
  isLoading = false;
  advanceSearchParams: any;
  quickSearchParams: any;
  dataMode = {
    GETOP: 0,
    ADVANDCE_SEARCH: 1,
    QUICK_SEARCH: 2
  };
  page_index = 1;
  page_size = 10;
  recordCount = 0;
  isOnpenInFile = false;
  menu_report: MenuReport[] = [];
  select_item_current = '';

  isAdvanceSearch = false;
  params: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private gridService: GridService,
  ) {
    route.data.subscribe(result => {
      const rs: any = result;
      this.ticketType = rs.ticketType;
      this.initDataByType();
      this.getTop();
      document.title = this.title;
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('useGridCached');
    if (this.entityName) {
      this.ticketApiService.getMenuReport(this.entityName).subscribe(result => {
        if (result && result.result && result.result.length) {
          this.menu_report = [...result.result];
        }
      });
    }
  }

  ngOnChanges(change: SimpleChanges): void {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  initDataByType() {
    switch (this.ticketType) {
      case TICKET_TYPE.RETAIL:
        this.columns = TICKET_FIELDS.RETAIL as any as Cell[];
        this.title = 'Ticket bán lẻ';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.RETAIL;
        this.codeName = TICKET_CODE.RETAIL;
        break;
      case TICKET_TYPE.SALE_ONLINE:
        this.columns = TICKET_FIELDS.SALE_ONLINE as Cell[];
        this.title = 'Ticket bán hàng online';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.ONLINE;
        this.codeName = TICKET_CODE.ONLINE;
        break;
      case TICKET_TYPE.SALE_ONLINE_ECOMMERCE:
        this.columns = TICKET_FIELDS.SALE_ONLINE_ECOMMERCE as Cell[];
        this.title = 'Ticket bán hàng online';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.ONLINE_ECOMMERCE;
        this.codeName = TICKET_CODE.ONLINE_ECOMMERCE;
        break;
      case TICKET_TYPE.SALE_WHOLE:
        this.columns = TICKET_FIELDS.SALE_WHOLE as Cell[];
        this.title = 'Ticket bán buôn';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.WHOLE;
        this.codeName = TICKET_CODE.WHOLE;
        break;
      case TICKET_TYPE.SALE_AFFILIATE:
        this.columns = TICKET_FIELDS.SALE_AFFILIATE as Cell[];
        this.title = 'Ticket bán hàng liên kết';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.AFFILIATE;
        this.codeName = TICKET_CODE.AFFILIATE;
        break;
      case TICKET_TYPE.SALE_TELECOM:
        this.columns = TICKET_FIELDS.SALE_TELECOM as Cell[];
        this.title = 'Ticket bán hàng liên kết với nhà mạng';
        // this.service.setEntityname(TICKET_ENTITY.TELECOM);
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.TELECOM;
        this.codeName = TICKET_CODE.TELECOM;
        break;
      case TICKET_TYPE.SALE_ITINERANT:
        this.columns = TICKET_FIELDS.SALE_ITINERANT as Cell[];
        this.title = 'Ticket bán lưu động';
        // this.service.setEntityname('SVTran');
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.ITINERANT;
        this.codeName = TICKET_CODE.ITINERANT;
        break;
      case TICKET_TYPE.SALE_SERVICE:
        this.columns = TICKET_FIELDS.SALE_SERVICE as Cell[];
        this.title = 'Ticket bán dịch vụ';
        // this.service.setEntityname('SVTran');
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.SERVICE;
        this.codeName = TICKET_CODE.SERVICE;
        break;
      case TICKET_TYPE.SALE_RETURN:
        this.columns = TICKET_FIELDS.SALE_RETURN as Cell[];
        console.log('this.columns', this.columns)
        this.title = 'Ticket nhập hàng trả lại';
        // this.service.setEntityname(TICKET_ENTITY.RETURN);
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.RETURN;
        this.codeName = TICKET_CODE.RETURN;
        break;
      case TICKET_TYPE.SALE_RETURN_SERVICE:
        this.columns = TICKET_FIELDS.SALE_RETURN_SERVICE as Cell[];
        this.title = 'Ticket dịch vụ trả lại';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.RETURN_SERVICE;
        this.codeName = TICKET_CODE.RETURN_SERVICE;
        break;
      case TICKET_TYPE.SALE_CHANGE:
        this.columns = TICKET_FIELDS.SALE_CHANGE as Cell[];
        this.title = 'Ticket đổi hàng';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.CHANGE;
        this.codeName = TICKET_CODE.CHANGE;
        break;
      case TICKET_TYPE.SALE_GIFT_REPAY:
        this.columns = TICKET_FIELDS.SALE_GIFT_REPAY as Cell[];
        this.title = 'Ticket trả nợ quà';
        // this.service.setEntityname('SVTran_BHI');
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.GIFT_REPAY;
        this.codeName = TICKET_CODE.GIFT_REPAY;
        break;
      case TICKET_TYPE.SALE_REPURCHASE:
        this.columns = TICKET_FIELDS.SALE_REPURCHASE as Cell[];
        this.title = 'Ticket mua lại hàng';
        // this.service.setEntityname(TICKET_ENTITY.REPURCHASE);
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.REPURCHASE;
        this.codeName = TICKET_CODE.REPURCHASE;
        break;
      case TICKET_TYPE.SALE_RENEW:
        this.columns = TICKET_FIELDS.SALE_RENEW as Cell[];
        this.title = 'Ticket thu cũ đổi mới';
        // this.service.setEntityname('SVTran');
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.RENEW;
        this.codeName = TICKET_CODE.RENEW;
        break;
      case TICKET_TYPE.SALE_CONTRACT:
        this.columns = TICKET_FIELDS.SALE_CONTRACT as Cell[];
        this.title = 'Hợp đồng';
        this.primaryKey = 'stt_rec';
        this.entityName = 'SVTran_DXA';
        this.codeName = 'DXA';
        break;
      case TICKET_TYPE.SALE_RETURN_ONLINE:
        this.columns = TICKET_FIELDS.SALE_RETURN_ONLINE as Cell[];
        this.title = 'Phiếu nhập hàng bán trả lại Online';
        this.primaryKey = 'stt_rec';
        this.entityName = 'SVTran_HDR';
        this.codeName = 'HDR';
        break;
    }
  }

  getTop() {
    const observer = {
      next: (result: any) => { this.dataSource = result.result; },
      error: () => { },
      complete: () => this.isLoading = false
    };
    if (!this.isLoading) {
      this.getDataMode = this.dataMode.GETOP;
      this.isLoading = true;
      this.hiddenPagination = true;
      this.ticketApiService.getTop(this.entityName).subscribe(observer);
    }
  }

  advanceSearch(params: any) {
    const observer = {
      next: (result: any) => {
        //lưu params tìm kiếm vào localStorage
        localStorage.setItem('saleSearchParams', JSON.stringify(params));

        //lưu vào local storage kết quả và tham số tìm kiếm
        // const adv_search_data: any = {
        //   is_quick_search: false,
        //   is_advance_search: true,
        //   entity: this.entityName,
        //   result: result.result
        // };
        // localStorage.setItem(`saleSearchData_${this.entityName}`, JSON.stringify(adv_search_data));

        this.dataSource = result.result.items;
        this.recordCount = result.result.recordCount;
      },
      error: () => { },
      complete: () => this.isLoading = false
    };
    if (!this.isLoading) {
      this.isAdvanceSearch = true;
      this.getDataMode = this.dataMode.ADVANDCE_SEARCH;
      this.isLoading = true;
      this.hiddenPagination = false;
      this.ticketApiService.getTicketByQuery(this.entityName, params, this.page_index, this.page_size).subscribe(observer);
    }
  }

  quickSearch(params: any) {
    const observer = {
      next: (result: any) => { this.dataSource = result.result.items; this.recordCount = result.result.recordCount; },
      error: () => { },
      complete: () => this.isLoading = false
    };
    if (!this.isLoading) {
      if (params.so_ct && params.so_ct !== '') {
        this.getDataMode = this.dataMode.QUICK_SEARCH;
        this.isLoading = true;
        this.hiddenPagination = false;
        this.ticketApiService.getTicketByQuickSearch(this.entityName, params, this.page_index, this.page_size).subscribe(observer);
      }
      else {
        this.getDataMode = this.dataMode.GETOP;
        this.isLoading = true;
        this.hiddenPagination = true;
        this.ticketApiService.getTop(this.entityName).subscribe({
          next: (x: any) => { this.dataSource = x.result; this.recordCount = x.result.length; },
          error: () => { },
          complete: () => this.isLoading = false
        });
      }
    }
  }

  onCreate() {
    this.router.navigate([this.router.url + '/create']);
  }

  onFreeze() {

  }

  onReload() {
    if (this.getDataMode === this.dataMode.GETOP) {
      this.getTop();
    } else if (this.getDataMode === this.dataMode.ADVANDCE_SEARCH) {
      this.advanceSearch(this.advanceSearchParams);
    } else if (this.getDataMode === this.dataMode.QUICK_SEARCH) {
      this.quickSearch(this.quickSearchParams);
    }
  }

  toggleOpenOptionInFile() {
    this.isOnpenInFile = !this.isOnpenInFile;
  }

  onClickInvoicePrint(option_report: MenuReport) {
    if (this.select_item_current && option_report.controller && option_report.form_id) {
      this.isLoading = true;
      option_report.controller = option_report.controller.trim();
      option_report.form_id = option_report.form_id.trim();
      this.gridService.openPrintDialog(this.select_item_current, option_report).then((value) => {
        this.isLoading = false;
        if (value) {
          // this.handleButton.emit({ buttonId: button.PrintButton.id, data: this.dataSource.data[this.focusRow] });
        }
      });
    } else {
      this.commonService.showMessage('Chưa chọn chứng từ cần in');
    }
  }

  onDeleteItem(event: { item: any }) {
    // this.commonService.openDialog(DialogConfirmComponent).afterClosed().subscribe(confirm => {
    //   if (confirm) {

    //   }
    // });

    this.ticketApiService.deleteOne(this.entityName, event.item.stt_rec).subscribe(result => {
      if (result && result.success && result.result) {
        this.onReload();
      } else {
        this.commonService.showMessage('Xóa voucher không thành công');
      }
    });

  }

  btnDeleteClickHandle() {
    if (!this.select_item_current || this.select_item_current === '')
      return;

    this.commonService.openDialog(DialogConfirmComponent).afterClosed().subscribe(confirm => {
      if (confirm) {
        this.ticketApiService.getVoucherStatus(this.entityName, this.select_item_current).subscribe((x: any) => {
          if (x && x.status === '0') {
            this.ticketApiService.deleteOne(this.entityName, this.select_item_current).subscribe(result => {
              if (result && result.success && result.result) {
                this.onReload();
              } else {
                this.commonService.showMessage('Xóa voucher không thành công');
              }
            });
          } else {
            this.commonService.showMessage('Phiếu đã thay đổi trạng thái, không thể xóa!');
          }
        });
      }
    });

  }

  openAdvancedSearchDialog() {
    this.commonService.openDialog(AdvancedSearchDialogComponent, this.advanceSearchParams, 'advanced-search-style-dialog', false, '850px')
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const userJson = localStorage.getItem('user');
          const userObj = userJson !== null && JSON.parse(userJson);
          const params = { ...result };
          params.ma_ct = this.codeName;
          params.ma_cuahang = userObj['shop'];
          this.advanceSearchParams = params;
          this.page_index = 1;
          this.params = params;
          this.advanceSearch(params);
        }
      });
  }

  onChangeQuickSearchInput(value: string) {
    const params = {} as any;
    params.so_ct = value;
    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);
    params.ma_ct = this.codeName;
    params.ma_cuahang = userObj['shop'];
    this.quickSearchParams = params;
    this.page_index = 1;
    this.quickSearch(this.quickSearchParams);
  }

  onUpdateItem(event: { item: any }) {
    const queryParams = {} as any;
    queryParams.key = (event.item as any)[this.primaryKey];
    this.router.navigate([this.router.url + '/update'], { queryParams });
  }

  btnUpdateClickHandle() {
    if (this.select_item_current && this.select_item_current !== '') {
      this.ticketApiService.getVoucherStatus(this.entityName, this.select_item_current).subscribe((result: any) => {
        if (result && result.status === '0') {
          const queryParams = {} as any;
          queryParams.key = this.select_item_current;
          this.router.navigate([this.router.url + '/update'], { queryParams });
        } else {
          this.commonService.showMessage('Phiếu đã thay đổi trạng thái, không thể sửa!');
        }
      });

    }
  }

  onCreateWholeSale(event: { item: any }) {
    const queryParams = {} as any;
    queryParams.key = (event.item as any)[this.primaryKey];
    queryParams.fromContract = true;
    this.router.navigate(['/sales/whole/create'], { queryParams });
  }

  btnViewClickHandle() {
    if (this.select_item_current && this.select_item_current !== '') {
      const queryParams = {} as any;
      queryParams.key = this.select_item_current;
      this.router.navigate([this.router.url + '/view'], { queryParams });
    }
  }

  onViewItem(item: string) {
    const queryParams = {} as any;
    queryParams.key = (item as any)[this.primaryKey];
    this.router.navigate([this.router.url + '/view'], { queryParams });
  }

  onChangePage(event: number) {
    if (event !== this.page_index) {
      this.page_index = event
      if (this.isAdvanceSearch) {
        this.advanceSearch(this.params);
      } else {
        this.quickSearch(this.quickSearchParams);
      }
    }
  }

  onChangePageSize(event: string) {
    this.page_size = +event;
    if (this.isAdvanceSearch) {
      this.advanceSearch(this.params);
    } else {
      this.quickSearch(this.quickSearchParams);
    }
  }

  onSelectMerchandise(event: any) {
    if (event.item && event.item.stt_rec) {
      this.select_item_current = event.item.stt_rec;
    }
  }
}
