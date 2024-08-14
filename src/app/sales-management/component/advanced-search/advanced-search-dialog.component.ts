import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import dataFormat from '@app/_common/dataFormat';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../search/serach-dialog.component';
import { formatDate } from '@angular/common';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';

interface IFilter {
  ngay_bd: string;
  ngay_kt: string;
  so_ct_bd: string;
  so_ct_kt: string;
  ma_kh: string;
  ma_kho: string;
  ma_vt: string;
  ma_imei: string;
  status: string;
  voucherCode: string;
  ten_kh: string;
  ten_kho: string;
  ma_kho2: string;
  ten_kho2: string;
  ten_vt: string;
  ma_cuahang: string;
  ma_ct: string;
}

@Component({
  selector: 'advanced-search',
  templateUrl: './advanced-search-dialog.component.html',
  styleUrls: ['./advanced-search-dialog.component.scss'],
})
export class AdvancedSearchDialogComponent implements OnInit {
  title = 'Thêm khách hàng';
  dataFormat = dataFormat;
  invalid = false;
  shop = JSON.parse(localStorage.getItem('shop') || '');
  ten_cuahang = '';

  filters: IFilter = {
    ngay_bd: '',
    ngay_kt: '',
    so_ct_bd: '',
    so_ct_kt: '',
    ma_kh: '',
    ma_kho: '',
    ma_vt: '',
    ma_imei: '',
    status: '',
    voucherCode: '',
    ten_kh: '',
    ten_kho: '',
    ma_kho2: '',
    ten_kho2: '',
    ten_vt: '',
    ma_cuahang: '',
    ma_ct: ''
  };

  statusList: StatusTicket[] = [
    {
      status: '*',
      statusname: 'Tất cả'
    },
    {
      status: '0',
      statusname: 'Lập chứng từ'
    },
    {
      status: '2',
      statusname: 'Hoàn thành'
    },
  ];

  voucherCode = '';
  date_from: Date | null = new Date();
  lbl_ma_kho = 'Mã kho';
  lbl_ten_kho = 'Tên kho';
  lbl_ma_kho2 = 'Mã kho 2';
  lbl_ten_kho2 = 'Tên kho 2';


  constructor(
    public dialogRef: MatDialogRef<AdvancedSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFilter,
    private customerApiService: CustomerApiService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit(): void {
    if (this.data && this.data.voucherCode)
      this.voucherCode = this.data.voucherCode;

    const convert = { ...this.data };

    //Lấy thông tin params từ localStorage
    const params_string = localStorage.getItem('saleSearchParams')!;
    if (params_string && params_string !== '') {
      const search_params: any = JSON.parse(params_string);

      if (search_params.ngay_bd !== '') convert.ngay_bd = search_params.ngay_bd;
      if (search_params.ngay_kt !== '') convert.ngay_kt = search_params.ngay_kt;
      convert.status = search_params.status !== '' ? search_params.status : this.statusList[0].status;
    }

    if (convert.ngay_bd && convert.ngay_kt) {
      convert.ngay_bd = formatDate(new Date(convert.ngay_bd), 'yyyy-MM-dd', 'en_US');
      convert.ngay_kt = formatDate(new Date(convert.ngay_kt), 'yyyy-MM-dd', 'en_US');
    }

    if (!convert.status || convert.status === '') convert.status = this.statusList[0].status;
    if (!convert.ngay_bd || convert.ngay_bd === '') convert.ngay_bd = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
    if (!convert.ngay_kt || convert.ngay_kt === '') convert.ngay_kt = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');

    if (this.voucherCode === 'PXB' || this.voucherCode === 'pxb') {
      this.lbl_ma_kho = 'Mã kho xuất';
      this.lbl_ten_kho = 'Tên kho xuất';
      this.lbl_ma_kho2 = 'Mã kho nhập';
      this.lbl_ten_kho2 = 'Tên kho nhập';
    }
    if (this.voucherCode === 'PNF' || this.voucherCode === 'pnf') {
      this.lbl_ma_kho = 'Mã kho nhập';
      this.lbl_ten_kho = 'Tên kho nhập';
      this.lbl_ma_kho2 = 'Mã kho xuất';
      this.lbl_ten_kho2 = 'Tên kho xuất';
    }

    const userInfo = JSON.parse(localStorage.getItem('user') || '');
    if (userInfo) {
      convert.ma_cuahang = userInfo.shop;
      if (this.isShowShop()) {
        if (this.shop?.length) {
          this.ten_cuahang = this.shop.find((e: any) => e.ma_cuahang === userInfo.shop)?.ten_cuahang;
          if (!this.ten_cuahang) {
            this.commonService.showMessage("Không tìm thấy thông tin cửa hàng");
          }
        } else {
          this.commonService.showMessage("Không có danh sách cửa hàng");
        }
      }
    } else {
      this.commonService.showMessage("Không tìm thấy thông tin người dùng");
    }

    Object.assign(this.filters, convert);
  }

  // #region config form
  isShowShop() {
    if ([TICKET_CODE.STOCK_PROPOSEDPURCHASE,
    TICKET_CODE.STOCK_TRANFER,
    TICKET_CODE.STOCK_TRANFER_IN,
    TICKET_CODE.STOCK_INTERNAL_SALE,
    TICKET_CODE.STOCK_INTERNAL_PURCHASE,
    TICKET_CODE.STOCK_RECOMMENT_TO_USE,
    TICKET_CODE.STOCK_EVENT_GIFT,
    TICKET_CODE.STOCK_LOAN_OUT,
    TICKET_CODE.STOCK_WARRANTY_OUT,
    TICKET_CODE.STOCK_LOAN_RECOVERY,
    TICKET_CODE.STOCK_WARRANTY_IN,
    TICKET_CODE.STOCK_RECEIPT,
    TICKET_CODE.STOCK_RETURN_SUPPILER,
    TICKET_CODE.STOCK_DEBT_RECEIPT,
    TICKET_CODE.STOCK_DEPOSIST_RECEIPT,
    TICKET_CODE.STOCK_COLLECTION_RECEIPT,
    TICKET_CODE.STOCK_OTHER_RECEIPT,
    TICKET_CODE.DEPOSIST_RETURN_PAYMENT,
    TICKET_CODE.CLOSE_SHIFT_PAYMENT,
    TICKET_CODE.OTHER_PAYMENT
    ].includes(this.voucherCode)
    ) {
      return true;
    }
    return false;
  }

  isShowImei() {
    if ([
      TICKET_CODE.STOCK_DEBT_RECEIPT,
      TICKET_CODE.STOCK_DEPOSIST_RECEIPT,
      TICKET_CODE.STOCK_COLLECTION_RECEIPT,
      TICKET_CODE.STOCK_OTHER_RECEIPT,
      TICKET_CODE.DEPOSIST_RETURN_PAYMENT,
      TICKET_CODE.CLOSE_SHIFT_PAYMENT,
      TICKET_CODE.OTHER_PAYMENT
    ].includes(this.voucherCode)
    ) {
      return false;
    }
    return true;
  }

  isShowInventory() {
    if ([
      TICKET_CODE.STOCK_DEBT_RECEIPT,
      TICKET_CODE.STOCK_DEPOSIST_RECEIPT,
      TICKET_CODE.STOCK_COLLECTION_RECEIPT,
      TICKET_CODE.STOCK_OTHER_RECEIPT,
      TICKET_CODE.DEPOSIST_RETURN_PAYMENT,
      TICKET_CODE.CLOSE_SHIFT_PAYMENT,
      TICKET_CODE.OTHER_PAYMENT
    ].includes(this.voucherCode)
    ) {
      return false;
    }
    return true;
  }
  // #region config form

  // #region customer
  onEnterCustomerCode(ma_kh: string) {
    this.openSearchCustomerDialog(ma_kh);
  }

  openSearchCustomerDialog(ma_kh?: string) {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: ma_kh || '', componentName: SEARCH_COMPONENT_NAME.CUSTOMER, title: 'Danh sách mã khách hàng' }, 'search-style-dialog')
      .afterClosed()
      .subscribe((customer: any) => {
        if (customer) {
          this.filters.ma_kh = customer.ma_kh;
          this.filters.ten_kh = customer.ten_kh;
        }
      }
      );
  }
  // #endregion customer

  openWarehouseDialog(ma_kho: string, ten_kho: string, ma_vt?: string) {
    this.commonService.openDialog(SearchDialogComponent, {
      keyword: ma_vt || '',
      componentName: SEARCH_COMPONENT_NAME.WAREHOUSE
    }, 'search-style-dialog')
      .afterClosed().subscribe(result => {
        if (result) {
          (this.filters as any)[ma_kho] = result.ma_kho;
          (this.filters as any)[ten_kho] = result.ten_kho;
        }
      });
  }

  // #region merchandise
  openMerchandiseDialog(ma_vt?: string) {
    this.commonService.openDialog(SearchDialogComponent, {
      keyword: ma_vt || '',
      componentName: SEARCH_COMPONENT_NAME.MERCHANDISE
    }, 'search-style-dialog')
      .afterClosed().subscribe(result => {
        if (result) {
          this.filters.ma_vt = result.ma_vt;
          this.filters.ten_vt = result.ten_vt;
        }
      });
  }

  onEnterMerchandiseCode(ma_vt: string) {
    this.openMerchandiseDialog(ma_vt);
  }

  handleEnterShop(ma_cuahang: string) {
    const shop = this.shop.find((e: any) => e.ma_cuahang === ma_cuahang.trim());
    if (shop) {
      this.filters.ma_cuahang = shop.ma_cuahang;
      this.ten_cuahang = shop?.ten_cuahang;
    } else {
      this.ten_cuahang = ''
    }
  }

  // #endregion merchandise

  openSearchShopDialog() {
    this.commonService.openDialog(SearchDialogComponent, { dataSource: this.shop, componentName: SEARCH_COMPONENT_NAME.SHOP_INFO })
      .afterClosed().subscribe(result => {
        this.filters.ma_cuahang = result?.ma_cuahang;
        this.ten_cuahang = result?.ten_cuahang;
      });
  }

  onBlurDateStart(event: any, ref: any) {
    this.filters.ngay_bd = ref.isoDateString.toString();
  }

  onBlurDateEnd(event: any, ref: any) {
    this.filters.ngay_kt = ref.isoDateString.toString();
  }

  onEnter(event: any, next_control: any) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
      if (next_control)
        if (next_control.input)
          next_control.input.nativeElement.focus();
        else
          next_control.focus();
    }

  }

  onSave() {
    this.invalid = false;
    if (!(this.filters.ngay_bd && this.filters.ngay_kt)) {
      this.invalid = true;
      return;
    }

    this.filters.ngay_bd = new Date(this.filters.ngay_bd).toISOString();
    this.filters.ngay_kt = new Date(this.filters.ngay_kt).toISOString();
    this.filters.ma_ct = this.filters.voucherCode;

    const keyValueArray = Object.entries(this.filters);
    for (const [key, value] of keyValueArray) {
      if (value === '') {
        delete this.filters[key as keyof typeof this.filters];
      }
    }

    //lưu param tìm kiếm vào localStorage
    const json_filter: string = JSON.stringify(this.filters);
    localStorage.setItem('saleSearchParams', json_filter);

    this.dialogRef.close(this.filters);
  }

  onCancel() {
    this.dialogRef.close();
  }

}

