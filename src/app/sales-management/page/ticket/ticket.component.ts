import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Button } from '@app/_components/grid/grid.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TICKET_TYPE } from '@app/sales-management/enum/ticket.enum';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { Cell } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.component';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { CommonService } from '../common/common.service';
import { AdvancedSearchDialogComponent } from '@app/sales-management/component/advanced-search/advanced-search-dialog.component';
import { GridService } from '@app/_components/gridV2/grid.service';
import { MenuReport } from '@app/_models';
import { DialogConfirmComponent } from '@app/_components/dialog/dialog-confirm/dialog-confirm.component';
import { filter } from 'rxjs';

//khai báo column các chứng từ bán hàng
const TICKET_FIELDS = require('@assets/fields/grid/sales-ticket.json')

//Khai báo column các chứng từ kho
const STOCK_FIELDS = require('@assets/fields/grid/voucher-stock-fields.json')

//Phiếu xuất điều chuyển GD (1,2)
const { TICKET: STOCK_TRANSFER_FROM_SHOP } = require('@assets/fields/grid/voucher-stock-transfer-from-shop.json')

//Nhập điều chuyển GD 1,2 (tạm chưa dùng)
const { TICKET: STOCK_TRANSFER_IN_SHOP } = require('@assets/fields/grid/voucher-stock-transfer-in-shop.json')

//Kiểm kê kho
const { TICKET: STOCK_SHOP_CHECK } = require('@assets/fields/grid/voucher-stock-shop-check.json')

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
  selected_status_row = '0';

  isAdvanceSearch = false;
  params: any;
  hasButton = {
    create: true,
    view: true,
    edit: true,
    delete: true
  }

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

    this.onReload(true)

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: any) => {
        return (this.route?.snapshot as any)['_routerState']?.url === event.url;
      })
    ).subscribe((event) => {
      this.onReload()
    });
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
      case TICKET_TYPE.SALE_REPURCHASE_SERVICE:
        this.columns = TICKET_FIELDS.SALE_REPURCHASE_SERVICE as Cell[];
        this.title = 'Ticket mua lại dịch vụ';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.REPURCHASE_SERVICE;
        this.codeName = TICKET_CODE.REPURCHASE_SERVICE;
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
        this.entityName = TICKET_ENTITY.CONTRACT;
        this.codeName = TICKET_CODE.CONTRACT;
        this.hasButton.create = false;
        break;
      case TICKET_TYPE.SALE_RETURN_ONLINE:
        this.columns = TICKET_FIELDS.SALE_RETURN_ONLINE as Cell[];
        this.title = 'Phiếu nhập hàng bán trả lại Online';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.RETURN_ONLINE;
        this.codeName = TICKET_CODE.RETURN_ONLINE;
        break;
      case TICKET_TYPE.VOUCHER_STOCK_TRANSFER_FROM_SHOP:
        this.columns = STOCK_TRANSFER_FROM_SHOP as Cell[];
        this.title = 'Phiếu xuất điều chuyển';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_TRANSFER_FROM_SHOP;
        this.codeName = TICKET_CODE.STOCK_TRANSFER_FROM_SHOP;
        break;
      case TICKET_TYPE.VOUCHER_STOCK_TRANSFER_IN_SHOP:
        this.columns = STOCK_TRANSFER_IN_SHOP as Cell[];
        this.title = 'Phiếu nhập điều chuyển';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_TRANSFER_IN_SHOP;
        this.codeName = TICKET_CODE.STOCK_TRANSFER_IN_SHOP;
        this.hasButton.create = false;
        break;
      case TICKET_TYPE.VOUCHER_STOCK_SHOP_CHECK:
        this.columns = STOCK_SHOP_CHECK as Cell[];
        this.title = 'Phiếu kiểm kê';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_SHOP_CHECK;
        this.codeName = TICKET_CODE.STOCK_SHOP_CHECK;
        break;

      case TICKET_TYPE.STOCK_PROPOSEDPURCHASE:
        this.columns = STOCK_FIELDS.STOCK_PROPOSEDPURCHASE as Cell[];
        this.title = 'Phiếu đề nghị xin hàng';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_PROPOSEDPURCHASE;
        this.codeName = TICKET_CODE.STOCK_PROPOSEDPURCHASE;
        break;
      case TICKET_TYPE.STOCK_TRANFER:
        this.columns = STOCK_FIELDS.STOCK_TRANFER as Cell[];
        this.title = 'Phiếu xuất điều chuyển';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_TRANFER;
        this.codeName = TICKET_CODE.STOCK_TRANFER;
        this.hasButton.create = false;
        break;
      case TICKET_TYPE.STOCK_TRANFER_IN:
        this.columns = STOCK_FIELDS.STOCK_TRANFER_IN as Cell[];
        this.title = 'Phiếu nhập điều chuyển';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_TRANFER_IN;
        this.codeName = TICKET_CODE.STOCK_TRANFER_IN;
        this.hasButton.create = false;
        this.hasButton.delete = false;
        break;
      case TICKET_TYPE.STOCK_INTERNAL_SALE:
        this.columns = STOCK_FIELDS.STOCK_INTERNAL_SALE as Cell[];
        this.title = 'Phiếu xuất bán nội bộ';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_INTERNAL_SALE;
        this.codeName = TICKET_CODE.STOCK_INTERNAL_SALE;
        this.hasButton.create = false;
        break;
      case TICKET_TYPE.STOCK_INTERNAL_PURCHASE:
        this.columns = STOCK_FIELDS.STOCK_INTERNAL_PURCHASE as Cell[];
        this.title = 'Phiếu nhập mua nội bộ';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_INTERNAL_PURCHASE;
        this.codeName = TICKET_CODE.STOCK_INTERNAL_PURCHASE;
        this.hasButton.create = false;
        this.hasButton.delete = false;
        break;
      case TICKET_TYPE.STOCK_RECOMMENT_TO_USE:
        this.columns = STOCK_FIELDS.STOCK_RECOMMENT_TO_USE as Cell[];
        this.title = 'Đề nghị xuất dùng';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_RECOMMENT_TO_USE;
        this.codeName = TICKET_CODE.STOCK_RECOMMENT_TO_USE;
        break;
      case TICKET_TYPE.STOCK_EVENT_GIFT:
        this.columns = STOCK_FIELDS.STOCK_EVENT_GIFT as Cell[];
        this.title = 'Xuất tặng hàng theo sự kiện';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_EVENT_GIFT;
        this.codeName = TICKET_CODE.STOCK_EVENT_GIFT;
        break;
      case TICKET_TYPE.STOCK_LOAN_OUT:
        this.columns = STOCK_FIELDS.STOCK_LOAN_OUT as Cell[];
        this.title = 'Phiếu xuất cho mượn';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_LOAN_OUT;
        this.codeName = TICKET_CODE.STOCK_LOAN_OUT;
        break;
      case TICKET_TYPE.STOCK_WARRANTY_OUT:
        this.columns = STOCK_FIELDS.STOCK_WARRANTY_OUT as Cell[];
        this.title = 'Phiếu xuất đi bảo hành';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_WARRANTY_OUT;
        this.codeName = TICKET_CODE.STOCK_WARRANTY_OUT;
        break;
      case TICKET_TYPE.STOCK_LOAN_RECOVERY:
        this.columns = STOCK_FIELDS.STOCK_LOAN_RECOVERY as Cell[];
        this.title = 'Nhập thu hổi hàng cho mượn';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_LOAN_RECOVERY;
        this.codeName = TICKET_CODE.STOCK_LOAN_RECOVERY;
        break;
      case TICKET_TYPE.STOCK_WARRANTY_IN:
        this.columns = STOCK_FIELDS.STOCK_WARRANTY_IN as Cell[];
        this.title = 'Nhập bảo hành';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_WARRANTY_IN;
        this.codeName = TICKET_CODE.STOCK_WARRANTY_IN;
        break;
      case TICKET_TYPE.STOCK_RECEIPT:
        this.columns = STOCK_FIELDS.STOCK_RECEIPT as Cell[];
        this.title = 'Phiếu nhập mua hàng NCC';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_RECEIPT;
        this.codeName = TICKET_CODE.STOCK_RECEIPT;
        this.hasButton.create = false;
        this.hasButton.delete = false;
        break;
      case TICKET_TYPE.STOCK_RETURN_SUPPILER:
        this.columns = STOCK_FIELDS.STOCK_RETURN_SUPPILER as Cell[];
        this.title = 'Đề nghị xuất trả NCC';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_RETURN_SUPPILER;
        this.codeName = TICKET_CODE.STOCK_RETURN_SUPPILER;
        break;
      case TICKET_TYPE.STOCK_DEBT_RECEIPT:
        this.columns = STOCK_FIELDS.STOCK_DEBT_RECEIPT as Cell[];
        this.title = 'Phiếu thu công nợ';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_DEBT_RECEIPT;
        this.codeName = TICKET_CODE.STOCK_DEBT_RECEIPT;
        break;
      case TICKET_TYPE.STOCK_DEPOSIST_RECEIPT:
        this.columns = STOCK_FIELDS.STOCK_DEPOSIST_RECEIPT as Cell[];
        this.title = 'Phiếu thu tiền đặt cọc';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_DEPOSIST_RECEIPT;
        this.codeName = TICKET_CODE.STOCK_DEPOSIST_RECEIPT;
        break;
      case TICKET_TYPE.STOCK_COLLECTION_RECEIPT:
        this.columns = STOCK_FIELDS.STOCK_COLLECTION_RECEIPT as Cell[];
        this.title = 'Phiếu thu hộ';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_COLLECTION_RECEIPT;
        this.codeName = TICKET_CODE.STOCK_COLLECTION_RECEIPT;
        break;
      case TICKET_TYPE.STOCK_OTHER_RECEIPT:
        this.columns = STOCK_FIELDS.STOCK_OTHER_RECEIPT as Cell[];
        this.title = 'Phiếu thu hộ khác';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_OTHER_RECEIPT;
        this.codeName = TICKET_CODE.STOCK_OTHER_RECEIPT;
        break;
      case TICKET_TYPE.DEPOSIST_RETURN_PAYMENT:
        this.columns = STOCK_FIELDS.DEPOSIST_RETURN_PAYMENT as Cell[];
        this.title = 'Phiếu chi hoàn cọc';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.DEPOSIST_RETURN_PAYMENT;
        this.codeName = TICKET_CODE.DEPOSIST_RETURN_PAYMENT;
        break;
      case TICKET_TYPE.CLOSE_SHIFT_PAYMENT:
        this.columns = STOCK_FIELDS.CLOSE_SHIFT_PAYMENT as Cell[];
        this.title = 'Phiếu chi chốt ca';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.CLOSE_SHIFT_PAYMENT;
        this.codeName = TICKET_CODE.CLOSE_SHIFT_PAYMENT;
        break;
      case TICKET_TYPE.TRANSFER_SHIFT_PAYMENT:
        this.columns = STOCK_FIELDS.TRANSFER_SHIFT_PAYMENT as Cell[];
        this.title = 'Phiếu chuyển tiền sang ca sau';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.TRANSFER_SHIFT_PAYMENT;
        this.codeName = TICKET_CODE.TRANSFER_SHIFT_PAYMENT;
        break;
      case TICKET_TYPE.OTHER_PAYMENT:
        this.columns = STOCK_FIELDS.OTHER_PAYMENT as Cell[];
        this.title = 'Phiếu chi khác';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.OTHER_PAYMENT;
        this.codeName = TICKET_CODE.OTHER_PAYMENT;
        break;
      case TICKET_TYPE.STOCK_COMPENSATION:
        this.columns = TICKET_FIELDS.STOCK_COMPENSATION as any as Cell[];
        this.title = 'Phiếu xuất đền bù hàng hóa';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.STOCK_COMPENSATION;
        this.codeName = TICKET_CODE.STOCK_COMPENSATION;
        break;
      case TICKET_TYPE.SERVICE_COMPENSATION:
        this.columns = TICKET_FIELDS.SERVICE_COMPENSATION as any as Cell[];
        this.title = 'Phiếu xuất đền bù dịch vụ';
        this.primaryKey = 'stt_rec';
        this.entityName = TICKET_ENTITY.SERVICE_COMPENSATION;
        this.codeName = TICKET_CODE.SERVICE_COMPENSATION;
        break;
    }
  }

  getTop() {
    const observer = {
      next: (result: any) => {

        if (result.success) {
          const voucherData = result?.result[0]?.voucher ?? result?.result ?? [];
          const paymentMethodData = result?.result[1]?.payment_method || [];

          this.commonService.saveTicketToLocalStorage(voucherData);

          this.dataSource = voucherData.map((voucherRecord: any) => {
            this.processTypeTransaction(voucherRecord);
            this.sanitizeRecord(voucherRecord);
            this.processPayments(voucherRecord, paymentMethodData);
            return voucherRecord;
          });
        }
      },
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
        const new_params: any = {
          ngay_bd: params.ngay_bd,
          ngay_kt: params.ngay_kt,
          voucherCode: params.voucherCode
        };
        localStorage.setItem('saleSearchParams', JSON.stringify(new_params));

        //lưu vào local storage kết quả và tham số tìm kiếm
        // const adv_search_data: any = {
        //   is_quick_search: false,
        //   is_advance_search: true,
        //   entity: this.entityName,
        //   result: result.result
        // };
        // localStorage.setItem(`saleSearchData_${this.entityName}`, JSON.stringify(adv_search_data));

        if (result.success) {
          const voucherData = result?.result?.items?.[0]?.voucher
            ?? result?.result?.items
            ?? [];
          const paymentMethodData = result?.result?.items?.[0]?.payment_method || [];

          this.commonService.saveTicketToLocalStorage(voucherData);

          this.dataSource = voucherData.map((voucherRecord: any) => {
            this.processTypeTransaction(voucherRecord);
            this.sanitizeRecord(voucherRecord);
            this.processPayments(voucherRecord, paymentMethodData);
            return voucherRecord;
          });
          this.recordCount = result.result.recordCount;
        }
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
      next: (result: any) => {
        if (result.success) {
          const voucherData = result?.result?.items[0]?.voucher
            ?? result?.result?.items
            ?? [];
          const paymentMethodData = result.result.items[0]?.payment_method || [];

          this.commonService.saveTicketToLocalStorage(voucherData);

          this.dataSource = voucherData.map((voucherRecord: any) => {
            this.processTypeTransaction(voucherRecord);
            this.sanitizeRecord(voucherRecord);
            this.processPayments(voucherRecord, paymentMethodData);
            return voucherRecord;
          });
          this.recordCount = result.result.recordCount;
        }
      },
      error: () => { },
      complete: () => this.isLoading = false
    };
    if (!this.isLoading) {
      this.isAdvanceSearch = false;
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
          next: (x: any) => {
            if (x.success) {
              const voucherData = x?.result[0]?.voucher || [];
              const paymentMethodData = x?.result[1]?.payment_method || [];

              this.commonService.saveTicketToLocalStorage(voucherData);

              this.dataSource = voucherData.map((voucherRecord: any) => {
                this.sanitizeRecord(voucherRecord);
                this.processPayments(voucherRecord, paymentMethodData);
                return voucherRecord;
              });
              this.recordCount = x?.result[0]?.voucher.length;
            }
          },
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

  onReload(isReload = false) {
    if (this.getDataMode === this.dataMode.GETOP) {
      // Nếu isReload là true, luôn luôn tải lại dữ liệu
      if (!isReload && this.dataSource && this.dataSource.length > 0) {
        return;
      } else {
        this.getTop();
      }
    } else if (this.getDataMode === this.dataMode.ADVANDCE_SEARCH) {
      // Nếu isReload là true, luôn luôn tải lại dữ liệu
      if (!isReload && this.dataSource && this.dataSource.length > 0) {
        return;
      } else {
        this.advanceSearch(this.advanceSearchParams);
      }
    } else if (this.getDataMode === this.dataMode.QUICK_SEARCH) {
      // Nếu isReload là true, luôn luôn tải lại dữ liệu
      if (!isReload && this.dataSource && this.dataSource.length > 0) {
        return;
      } else {
        this.quickSearch(this.quickSearchParams);
      }
    }
  }

  toggleOpenOptionInFile() {
    this.isOnpenInFile = !this.isOnpenInFile;
  }

  onClickInvoicePrint(option_report: MenuReport) {
    if (this.select_item_current && option_report.controller && option_report.form_id) {
      /* Chặn in trạng thái lct theo phiếu */
      // const ARRAY_VOURCHER = [
      //   'SVTran_BHA',
      //   'SVTran_BHC',
      // ];
      // if (ARRAY_VOURCHER.includes(option_report.controller)) {
      //   // trạng thái lct ko được in
      //   if (this.selected_status_row === '0') {
      //     this.commonService.showMessage('Không thể in phiếu chưa hoàn thành');
      //     return;
      //   }
      // }
      /* END */

      // trạng thái lct ko được in
      if (this.selected_status_row === '0') {
        this.commonService.showMessage('Không thể in phiếu chưa hoàn thành');
        return;
      }

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
        this.onReload(true);
      } else {
        if (result && !result.success && result.message && result.message !== '') {
          this.commonService.showMessageByName(result.message, []);
          return;
        }
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
                this.onReload(true);
              } else {
                if (result && !result.success && result.message && result.message !== '') {
                  this.commonService.showMessageByName(result.message);
                  return;
                }
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
    const filter_params: any = localStorage.getItem('saleSearchParams');
    this.commonService.openDialog(AdvancedSearchDialogComponent, { voucherCode: this.codeName, ...filter_params }, 'advanced-search-style-dialog', false, '850px')
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const params = { ...result };
          this.advanceSearchParams = params;
          this.page_index = 1;
          this.params = params;
          this.advanceSearch(params);
        }
      });
  }

  onChangeQuickSearchInput(value: string) {
    const params = {} as any;
    if (this.entityName === TICKET_ENTITY.STOCK_TRANSFER_FROM_SHOP) {
      params.PXB_2 = "true"
    }
    else { params.PXB_2 = "false" }
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
        // cho phép sửa đối với trạng thái 0 (lập chứng từ)
        // hoặc status = 1 & mã chứng từ PXN (phiếu xuất bán nội bộ chờ duyệt)
        if (result && (result.status === '0' || (this.codeName === 'PXN' && result.status === '1'))) {
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
      this.selected_status_row = event.item.status;
    }
  }

  processTypeTransaction(voucherRecord: any): void {
    if(this.codeName === TICKET_CODE.REPURCHASE) {
      if(voucherRecord.fcode1.trim() === '1') {
        voucherRecord.fcode1 = "1-Mua lại từ KH cá nhân"
      }
      if(voucherRecord.fcode1.trim() === '2') {
        voucherRecord.fcode1 = "2-Mua lại từ KH doanh nghiệp"
      }
      if(voucherRecord.fcode1.trim() === '3') {
        voucherRecord.fcode1 = "3-Mua thu cũ ko lên đời"
      }
    }
  }

  /*
  * Hàm xử lý các thêm các trường tiền thanh toán cho phiếu
  */
  processPayments(voucherRecord: any, paymentMethodData: any[]): void {
    const paymentFieldMap: { [key: string]: string } = {
      "TIENCOC": "t_dat_coc",
      "TM": "tien_mat",
      "ATM": "quet_the",
      "QTTG": "quet_the_tgop",
      "CHUYENKHOAN": "chuyen_khoan",
      "VIDT": "vi_dien_tu",
      "VNPAY": "vnpay",
      "TRAGOP": "tr_gop",
      "DIEMQD": "sd_diem",
      "VOUCHERDOITAC": "voucher_doi_tac",
      "CONGNO": "t_con_no",
    };

    Object.values(paymentFieldMap).forEach(fieldName => {
      voucherRecord[fieldName] = 0;
    });

    const relatedPayments = paymentMethodData.filter(
      (payment: any) => payment.stt_rec === voucherRecord.stt_rec
    );

    relatedPayments.forEach((payment: any) => {
      const fieldName = paymentFieldMap[payment.ma_thanhtoan];
      if (fieldName) {
        voucherRecord[fieldName] = payment.tien;
      }
    });
  }

  /*
  * Hàm xử lý các các trường trong dữ liệu trả ra
  * nếu là {} thì đổi nó thành '' tránh hiển thị object trên giao diện
  */
  sanitizeRecord(record: any): any {
    Object.keys(record).forEach(key => {
      const field = record[key];
      record[key] = typeof field === 'object' && field !== null
        ? '' // Nếu là object, chuyển thành chuỗi rỗng
        : field ?? ''; // Nếu null/undefined, chuyển thành chuỗi rỗng
    });
    return record;
  }
}
