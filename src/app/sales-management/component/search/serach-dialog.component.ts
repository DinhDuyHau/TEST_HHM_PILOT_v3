import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cell } from '../form-control-custom/table-custom/table-custom.component';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { from, map, Observable, of, skip, take, tap, toArray } from 'rxjs';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { PaymentApiService } from '@app/sales-management/api/payment-api.service';
import { MerchandiseServiceApiService } from '@app/sales-management/api/merchandiseService-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { POSService } from '@app/sales-management/api/pos-api.service';
import { AuthenticationService } from '@app/_services';

const {
  TICKET_CODE,
  TICKET_ENTITY,
  CUSTOMER_SEARCH,
  MERCHANDISE_SEARCH,
  IMEI_SEARCH,
  BANK_ACCOUNT_SEARCH,
  TYPE_MERCHANDISE,
  TYPE_INVENTORY,
  LIST_ASM,
  SERVICE_SEARCH,
  PACKAGE_SEARCH,
  PROJECT_SEARCH,
  CONTRACT_SEARCH,
  WAREHOUSE_LIST,
  INVOICE_LIST,
  LIST_POS,
  LIST_PRICE_RENEW,
  LIST_BGD,
  BANK_PUBLISH_CARD_SEARCH,
  EMPLOYEE_SEARCH
} = require('@assets/fields/grid/sales-fields-table.json');

const { STOCK_LIST, SHOP_INFO } = require('@assets/fields/grid/voucher-stock-transfer-from-shop.json')

@Component({
  selector: 'search-dialog',
  templateUrl: './serach-dialog.component.html',
  styleUrls: ['./serach-dialog.component.scss'],
})
export class SearchDialogComponent implements OnInit, AfterViewInit {
  dataSource: any[] = [];
  columns!: Cell[];
  page_index = 1;
  page_size = 10;
  recordCount = 0;
  filters!: ItemFilter[];
  defaultFilters: ItemFilter[] = [];
  sort!: ItemSort[];
  getData!: any;
  keyword = '';
  title = '';
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { keyword: string, componentName: number, title: string, ma_ct?: string, filter?: ItemFilter[], dataSource: any },
    private customerApiService: CustomerApiService,
    private imeiApiService: ImeiApiService,
    private merchandiseServiceApiService: MerchandiseServiceApiService,
    private paymentApiService: PaymentApiService,
    private ticketApiService: TicketApiService,
    private posService: POSService,
    private merchandiseApiService: MerchandiseApiService,
    private authenticateService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.title = this.data.title || '';
    this.filters = this.data.filter || [];
    const filter = {
      name: '',
      operator: 'like',
      value: ''
    };
    switch (this.data.componentName) {
      case SEARCH_COMPONENT_NAME.CUSTOMER:
        this.columns = CUSTOMER_SEARCH as any;
        filter.name = 'ma_kh';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.MERCHANDISE:
        this.columns = MERCHANDISE_SEARCH as any;
        filter.name = 'ma_vt';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.IMEI:
        this.columns = IMEI_SEARCH as any;
        filter.name = 'ma_vt';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.DELIVERY_EMP:
        this.columns = CUSTOMER_SEARCH as any;
        filter.name = 'nh_kh9';
        // filter.value = `%${this.data.keyword}%`;
        filter.value = 'NGKH20';
        filter.operator = "=";
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.DELIVERY_PARNER:
        this.columns = CUSTOMER_SEARCH as any;
        filter.name = 'nh_kh9';
        // filter.value = `%${this.data.keyword}%`;
        filter.value = 'NGKH21';
        filter.operator = "=";
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.BANK_ACCOUNT:
        this.columns = BANK_ACCOUNT_SEARCH as any;
        filter.name = 'tknh';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.BANK_PUBLISH_CARD:
        this.columns = BANK_PUBLISH_CARD_SEARCH as any;
        filter.name = 'ma_nh';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.INSTALLMENT_UNIT:
        this.columns = CUSTOMER_SEARCH as any;
        filter.name = 'ma_kh';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter, { name: 'nh_kh9', operator: '=', value: 'NGKH88' }];
        break;
      case SEARCH_COMPONENT_NAME.WALLET:
        this.columns = CUSTOMER_SEARCH as any;
        filter.name = 'ma_kh';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter, { name: 'vdt_yn', operator: '=', value: true }];
        break;
      case SEARCH_COMPONENT_NAME.SERVICE:
        this.columns = SERVICE_SEARCH as any;
        filter.name = 'ma_dv';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.CONTRACT:
        this.columns = CONTRACT_SEARCH as any;
        break;
      case SEARCH_COMPONENT_NAME.ITINERANT:
        this.columns = PROJECT_SEARCH as any;
        filter.name = 'ma_vv';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.TYPE_MERCHANDISE:
        this.columns = TYPE_MERCHANDISE as any;
        filter.name = 'ma_vt';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.TYPE_INVENTORY:
        this.columns = TYPE_INVENTORY as any;
        filter.name = 'ma_vt';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.WAREHOUSE:
        this.columns = WAREHOUSE_LIST as any;
        filter.name = 'ma_vt';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.INVOICE:
        this.columns = INVOICE_LIST as any;
        this.keyword = this.data.keyword;
        break;
      case SEARCH_COMPONENT_NAME.ASM_EMPLOYEE:
        this.columns = LIST_ASM as any;
        this.keyword = this.data.keyword;
        break;
      case SEARCH_COMPONENT_NAME.POS:
        this.columns = LIST_POS as any;
        filter.name = 'ma_pos';
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter, { name: 'ma_cuahang', operator: '=', value: this.authenticateService.userValue?.shop }];
        break;
      case SEARCH_COMPONENT_NAME.TYPE_RENEW:
        this.columns = LIST_PRICE_RENEW as any;
        break;
      case SEARCH_COMPONENT_NAME.OLD_RECEIVER_SUPPLIER:
        this.columns = CUSTOMER_SEARCH as any;
        // filter.name = 'ma_kh';
        // filter.value = `%${this.data.keyword}%`;
        // this.filters = [filter, { name: 'nh_kh9', operator: '=', value: 'NGKH99' }];
        filter.name = 'nh_kh9';
        filter.operator = '=';
        filter.value = 'NGKH99'
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.APPROVER_DIRECTOR:
        this.columns = LIST_BGD as any;
        this.keyword = this.data.keyword;
        break;
      case SEARCH_COMPONENT_NAME.E_COMMERCIAL:
        this.columns = CUSTOMER_SEARCH as any;
        filter.name = 'nh_kh9';
        filter.value = 'NGKH77';
        filter.operator = "=";
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.PACKAGE:
        this.columns = PACKAGE_SEARCH as any;
        filter.name = 'loai_vt';
        filter.operator = "=";
        filter.value = `03`;
        this.defaultFilters = [filter];
        break;
      case SEARCH_COMPONENT_NAME.STOCK_TRANSFER_FROM_SHOP:
        this.columns = STOCK_LIST as any;
        this.defaultFilters = this.data.filter || [];
        break;
      case SEARCH_COMPONENT_NAME.SHOP_INFO:
        this.columns = SHOP_INFO as any;
        break;
      case SEARCH_COMPONENT_NAME.SHOP_INFO:
        this.columns = SHOP_INFO as any;
        break;
      case SEARCH_COMPONENT_NAME.EMPLOYEE:
        this.columns = EMPLOYEE_SEARCH as any;
        filter.name = 'ma_kh';
        filter.operator = "like";
        filter.value = `%${this.data.keyword}%`;
        this.defaultFilters = [filter];
        break;
      default:
        break;
    }
  }

  ngAfterViewInit(): void {
    if (this.columns) {
      this.handleLoadata();
      this.cdr.detectChanges();
    }
  }

  ngAfterViewChecked() {
    // if (this.columns) {
    //   this.handleLoadata();
    // }
  }

  loadData(): Observable<any> {
    switch (this.data.componentName) {
      case SEARCH_COMPONENT_NAME.CUSTOMER:
        return this.customerApiService.findById(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.MERCHANDISE:
        return this.imeiApiService.getImeisV2(this.page_index, this.page_size, this.filters.find(x => x.name == 'ma_vt')?.value || '', this.filters.find(x => x.name == 'ten_vt')?.value || '', this.filters.find(x => x.name == 'ma_imei')?.value || '', this.filters.find(x => x.name == 'ma_kho')?.value || '', this.data.ma_ct || TICKET_CODE.RETAIL);
      case SEARCH_COMPONENT_NAME.IMEI:
        return this.imeiApiService.getImeisById(this.data.keyword);
      case SEARCH_COMPONENT_NAME.DELIVERY_EMP:
        return this.customerApiService.findById(this.defaultFilters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.DELIVERY_PARNER:
        return this.customerApiService.findById(this.defaultFilters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.E_COMMERCIAL:
        return this.customerApiService.findById(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.BANK_ACCOUNT:
        // return this.paymentApiService.getAllBankAccount();
        return this.paymentApiService.findBankAccountByPaymentMethod(this.data.keyword, this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.BANK_PUBLISH_CARD:
        return this.paymentApiService.findBankPublishCard(this.data.keyword, this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.INSTALLMENT_UNIT:
        return this.customerApiService.findById(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.WALLET:
        return this.customerApiService.findById(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.SERVICE:
        return this.merchandiseServiceApiService.findById(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.CONTRACT:
        return this.ticketApiService.getMany(TICKET_ENTITY.CONTRACT, {});
      case SEARCH_COMPONENT_NAME.ITINERANT:
        return this.ticketApiService.getProjects(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.TYPE_MERCHANDISE:
        return this.merchandiseApiService.getMany(this.filters);
      case SEARCH_COMPONENT_NAME.TYPE_INVENTORY:
        return this.merchandiseApiService.getManyTypeMerchadise(this.filters);
      case SEARCH_COMPONENT_NAME.WAREHOUSE:
        return this.merchandiseApiService.getManyWarehouse(this.filters);
      case SEARCH_COMPONENT_NAME.INVOICE:
        return this.ticketApiService.getDebitByCustomer({ ma_kh: this.keyword });
      case SEARCH_COMPONENT_NAME.ASM_EMPLOYEE:
        return this.ticketApiService.getASM(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.APPROVER_DIRECTOR:
        return this.ticketApiService.getBGD(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.POS:
        return this.posService.findById(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.TYPE_RENEW:
        return this.ticketApiService.getRenewPrice(this.filters.find(x => x.name == 'ma_vt')?.value, this.filters.find(x => x.name == 'ma_cuahang')?.value, this.filters.find(x => x.name == 'ma_ncc')?.value);
      case SEARCH_COMPONENT_NAME.OLD_RECEIVER_SUPPLIER:
        return this.customerApiService.findById(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.PACKAGE:
        return this.merchandiseServiceApiService.findById(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.STOCK_TRANSFER_FROM_SHOP:
        return this.ticketApiService.findStocks(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.SHOP_INFO:
        return this.findDataSourceLocal(this.filters, this.page_index, this.page_size);
      case SEARCH_COMPONENT_NAME.EMPLOYEE:
        return this.customerApiService.findById(this.filters, this.page_index, this.page_size)
      default:
        return of();
    }
  }

  findDataSourceLocal(filters: any[], page_index: number, page_size: number) {
    let res = this.data.dataSource.filter((e: any) => {
      let isMatch = true;
      filters.every(filter => {
        if (e.hasOwnProperty(filter.name)) {
          const value = filter.value.replace(/%/g, "");
          if (!e[filter.name].toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
            isMatch = false;
            return false;
          }
        }
        return true;
      })

      return isMatch;
    })

    const _skip = page_size * (page_index - 1);

    return from(res).pipe(
      skip(_skip),
      take(page_size),
      toArray(),
      map(items => ({
        result: {
          items: items,
          recordCount: res.length
        }
      }))
    )
  }

  handleLoadata() {
    const observer = {
      next: (result: any) => {
        if (result.result?.items) {
          this.dataSource = result.result.items;
          this.recordCount = result.result.recordCount;
        } else {
          this.dataSource = result.result as any;
        }
      },
      error: () => {
        //
      },
      complete: () => { this.isLoading = false; }
    };

    this.isLoading = true;
    this.loadData().subscribe(observer);
  }

  onSelectItem(event: { item: any }): void {
    this.dialogRef.close(event.item);
  }

  onClickSearchFilter(filters: any) {
    this.filters = this.filters.filter((item) => {
      return !filters.find((item2: any) => {
        return item2.name == item.name;
      });
    });

    const _defaultFilters = this.defaultFilters.filter((item) => {
      return !filters.find((item2: any) => {
        return item2.name == item.name;
      });
    });

    this.filters = [..._defaultFilters, ...filters];
    this.handleLoadata();
  }

  onChangePage(event: number) {
    if (this.page_index !== event) {
      this.page_index = event
      this.handleLoadata();
    }
  }

  onChangePageSize(event: string) {
    this.page_size = +event;
    this.handleLoadata();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close();
  }

}

export interface Result<T> {
  success: boolean,
  message: string,
  result: {
    pageIndex: number,
    pageCount: number,
    pageSize: number,
    recordCount: number,
    items: T[]
  }
}

export interface ItemFilter {
  name: string;
  value: any;
  operator?: string;
}

export interface ItemSort {
  name: string;
  direction: string;
}

export const SEARCH_COMPONENT_NAME = {
  MERCHANDISE: 0,
  CUSTOMER: 1,
  IMEI: 2,
  DELIVERY_EMP: 3,
  BANK_ACCOUNT: 4,
  INSTALLMENT_UNIT: 5,
  SERVICE: 6,
  CONTRACT: 7,
  ITINERANT: 8,
  TYPE_MERCHANDISE: 9,
  TYPE_INVENTORY: 10,
  WAREHOUSE: 11,
  INVOICE: 12,
  ASM_EMPLOYEE: 13,
  POS: 14,
  TYPE_RENEW: 15,
  WALLET: 16,
  OLD_RECEIVER_SUPPLIER: 17,
  APPROVER_DIRECTOR: 18,
  E_COMMERCIAL: 19,
  PACKAGE: 20,
  BANK_PUBLISH_CARD: 21,
  DELIVERY_PARNER: 22,
  STOCK_TRANSFER_FROM_SHOP: 23,
  SHOP_INFO: 24,
  EMPLOYEE: 25
};

