import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import dataFormat from '@app/_common/dataFormat';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../search/serach-dialog.component';
import { formatDate } from '@angular/common';
import { TICKET_CODE } from '@app/sales-management/model/common/ticket-code.model';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';

import { SEARCH_V2_COMPONENT_NAME, SearchV2DialogComponent } from '../search-v2/serach-v2-dialog.component';

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
  status2: string;
  voucherCode: string;
  ten_kh: string;
  ten_kho: string;
  ma_kho2: string;
  ten_kho2: string;
  ten_vt: string;
  ma_cuahang: string;
  ten_cuahang: string;
  ma_cuahang2: string;
  ten_cuahang2: string;
  ma_ct: string;
}

@Component({
  selector: 'advanced-search',
  templateUrl: './advanced-search-dialog.component.html',
  styleUrls: ['./advanced-search-dialog.component.scss'],
})
export class AdvancedSearchDialogComponent implements OnInit {
  @ViewChild('form') form!: ElementRef;
  title = 'Thêm khách hàng';
  dataFormat = dataFormat;
  invalid = false;
  shop = JSON.parse(localStorage.getItem('shop') || '');
  store = JSON.parse(localStorage.getItem('stock') || '');
  ten_cuahang = '';
  ten_cuahang2 = '';

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
    status2: '',
    voucherCode: '',
    ten_kh: '',
    ten_kho: '',
    ma_kho2: '',
    ten_kho2: '',
    ten_vt: '',
    ma_cuahang: '',
    ten_cuahang: '',
    ma_cuahang2: '',
    ten_cuahang2: '',
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

  lbl_ma_cuahang = 'Mã cửa hàng';
  lbl_ten_cuahang = 'Tên cửa hàng';
  lbl_ma_cuahang2 = 'Mã cửa hàng 2';
  lbl_ten_cuahang2 = 'Tên cửa hàng 2';

  lbl_trang_thai = 'Trạng thái';
  lbl_trang_thai2 = 'Trạng thái 2';

  constructor(
    public dialogRef: MatDialogRef<AdvancedSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFilter,
    private customerApiService: CustomerApiService,
    private commonService: CommonService,
    private ticketApiService: TicketApiService,
    private merchandiseApiService: MerchandiseApiService
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

    if (this.voucherCode === 'PXB' || this.voucherCode === 'pxb' || this.voucherCode === 'PXN' || this.voucherCode === 'pxn'
      || this.voucherCode === 'PR3' || this.voucherCode === 'pr3'
    ) {
      this.lbl_ma_kho = 'Mã kho xuất';
      this.lbl_ten_kho = 'Tên kho xuất';
      this.lbl_ma_kho2 = 'Mã kho nhập';
      this.lbl_ten_kho2 = 'Tên kho nhập';

      this.lbl_ma_cuahang = 'Mã cửa hàng xuất';
      this.lbl_ten_cuahang = 'Tên cửa hàng xuất';
      this.lbl_ma_cuahang2 = 'Mã cửa hàng nhập';
      this.lbl_ten_cuahang2 = 'Tên cửa hàng nhập';

      this.lbl_trang_thai = 'Trạng thái PX';
      this.lbl_trang_thai2 = 'Trạng thái PN';

    }
    if (this.voucherCode === 'PNF' || this.voucherCode === 'pnf'
      || this.voucherCode === 'PNN' || this.voucherCode === 'pnn'
    ) {
      this.lbl_ma_kho = 'Mã kho nhập';
      this.lbl_ten_kho = 'Tên kho nhập';
      this.lbl_ma_kho2 = 'Mã kho xuất';
      this.lbl_ten_kho2 = 'Tên kho xuất';

      this.lbl_ma_cuahang = 'Mã cửa hàng nhập';
      this.lbl_ten_cuahang = 'Tên cửa hàng nhập';
      this.lbl_ma_cuahang2 = 'Mã cửa hàng xuất';
      this.lbl_ten_cuahang2 = 'Tên cửa hàng xuất';

      this.lbl_trang_thai = 'Trạng thái PN';
      this.lbl_trang_thai2 = 'Trạng thái PX';
    }

    //set mặc định trạng thái 2
    convert.status2 = this.statusList[0].status;

    const userInfo = JSON.parse(localStorage.getItem('user') || '');
    if (userInfo) {
      // convert.ma_cuahang = userInfo.shop;
      // if (this.isShowShop()) {
      //   if (this.shop?.length) {
      //     this.ten_cuahang = this.shop.find((e: any) => e.ma_cuahang === userInfo.shop)?.ten_cuahang;
      //     if (!this.ten_cuahang) {
      //       this.commonService.showMessage("Không tìm thấy thông tin cửa hàng");
      //     }
      //   } else {
      //     this.commonService.showMessage("Không có danh sách cửa hàng");
      //   }
      // }
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
    TICKET_CODE.OTHER_PAYMENT,
    TICKET_CODE.RETAIL,
    TICKET_CODE.ONLINE_ECOMMERCE,
    TICKET_CODE.ONLINE,
    TICKET_CODE.WHOLE,
    TICKET_CODE.AFFILIATE,
    TICKET_CODE.CONTRACT,
    TICKET_CODE.TELECOM,
    TICKET_CODE.ITINERANT,
    TICKET_CODE.SERVICE,
    TICKET_CODE.RETURN,
    TICKET_CODE.RETURN_ONLINE,
    TICKET_CODE.RETURN_SERVICE,
    TICKET_CODE.CHANGE,
    TICKET_CODE.GIFT_REPAY,
    TICKET_CODE.REPURCHASE,
    TICKET_CODE.RENEW,
    TICKET_CODE.REPURCHASE_SERVICE
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

  isShowStockList() {
    if ([
      //TICKET_CODE.STOCK_PROPOSEDPURCHASE,
      TICKET_CODE.STOCK_TRANFER,
      TICKET_CODE.STOCK_TRANFER_IN,
      TICKET_CODE.STOCK_INTERNAL_SALE,
      TICKET_CODE.STOCK_INTERNAL_PURCHASE,
      TICKET_CODE.STOCK_SHOP_CHECK,
    ].includes(this.voucherCode)
    ) {
      return true;
    }
    return false;
  }
  // #region config form

  // #region customer
  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh.trim()).subscribe(result => {
      if (result?.result) {
        const res = result.result as any;
        this.filters.ma_kh = res.ma_kh;
        this.filters.ten_kh = res.ten_kh;
      } else {
        this.commonService.showMessage("Không tìm thấy khách hàng")
      }
    })
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

  getDataStock(ma_kho: string) {
    let infUser = JSON.parse(localStorage.getItem('user') || '');
    let stockData = JSON.parse(localStorage.getItem('stock') || '')
    if ([
      TICKET_CODE.STOCK_TRANFER,
      TICKET_CODE.STOCK_TRANFER_IN,
      TICKET_CODE.STOCK_INTERNAL_SALE,
      TICKET_CODE.STOCK_INTERNAL_PURCHASE
    ].includes(this.voucherCode)) {
      if (ma_kho && ma_kho === 'ma_kho') {
        stockData = stockData.filter((items: any) => items.ma_cuahang === infUser.shop);
      }
    }
    return stockData;
  }

  openWarehouseDialog2(ma_kho: string, ma_vt?: string) {
    let selectedStock;
    if (this.filters.ma_kho && ma_kho === 'ma_kho') {
      selectedStock = this.filters.ma_kho.split(',').map(item => item.trim())
    }
    if (this.filters.ma_kho2 && ma_kho === 'ma_kho2') {
      selectedStock = this.filters.ma_kho2.split(',').map(item => item.trim())
    }
    this.commonService.openDialog(SearchV2DialogComponent, {
      keyword: ma_vt || '',
      stockData: this.getDataStock(ma_kho),
      selectedStock: selectedStock,
      componentName: SEARCH_V2_COMPONENT_NAME.WAREHOUSE,
      isFilter: true
    }, 'search-style-dialog')
      .afterClosed().subscribe(result => {
        if (result) {
          (this.filters as any)[ma_kho] = result.map((item: any) => item.ma_kho).join(', ');
        }
      });
  }

  onEnterWarehouseInput(ma_kho: string) {
    /* if (!ma_kho || ma_kho === '') return;
    this.ticketApiService.findOneByCode(ma_kho.trim()).subscribe(result => {
      if (result?.result?.items.length) {
        const res = result.result.items[0];
        this.filters.ma_kho = res.ma_kho;
        this.filters.ten_kho = res.ten_kho;
      } else {
        this.commonService.showMessage("Không tìm thấy kho")
      }
    }) */

    if (!ma_kho || ma_kho === '' || !this.store || this.store.length <= 0) return;
    const store_item = this.store.find((x: { ma_kho: string; }) => x.ma_kho.trim().toLowerCase() === ma_kho.trim().toLowerCase());
    if (store_item) {
      this.filters.ma_kho = store_item.ma_kho;
      this.filters.ten_kho = store_item.ten_kho;
    } else {
      this.commonService.showMessage("Không tìm thấy kho")
    }
  }

  onEnterWarehouseOutput(ma_kho2: string) {
    if (!ma_kho2 || ma_kho2 === '' || !this.store || this.store.length <= 0) return;
    const store_item = this.store.find((x: { ma_kho: string; }) => x.ma_kho.trim().toLowerCase() === ma_kho2.trim().toLowerCase());
    if (store_item) {
      this.filters.ma_kho2 = store_item.ma_kho;
      this.filters.ten_kho2 = store_item.ten_kho;
    } else {
      this.commonService.showMessage("Không tìm thấy kho")
    }
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
    this.merchandiseApiService.getOneById(ma_vt.trim()).subscribe(result => {
      if (result?.result) {
        const res = result.result as any;
        this.filters.ma_vt = res.ma_vt;
        this.filters.ten_vt = res.ten_vt;
      } else {
        this.commonService.showMessage("Không tìm thấy hàng hóa")
      }
    })
  }

  handleEnterShop(ma_cuahang: string) {
    const shop = this.shop.find((e: any) => (e.ma_cuahang as string).toLowerCase() === ma_cuahang.trim().toLowerCase());
    if (shop) {
      this.filters.ma_cuahang = shop.ma_cuahang;
      this.ten_cuahang = shop?.ten_cuahang;
    } else {
      this.filters.ma_cuahang = ma_cuahang;
      this.ten_cuahang = ''
    }

  }

  handleEnterShop2(ma_cuahang: string) {
    const shop = this.shop.find((e: any) => (e.ma_cuahang as string).toLowerCase() === ma_cuahang.trim().toLowerCase());
    if (shop) {
      this.filters.ma_cuahang2 = shop.ma_cuahang;
      this.ten_cuahang2 = shop?.ten_cuahang;
    } else {
      this.filters.ma_cuahang2 = ma_cuahang;
      this.ten_cuahang2 = ''
    }

  }

  // #endregion merchandise

  openSearchShopDialog() {
    this.commonService.openDialog(SearchDialogComponent, { dataSource: this.shop, componentName: SEARCH_COMPONENT_NAME.SHOP_INFO })
      .afterClosed().subscribe(result => {
        if (result?.ma_cuahang) {
          this.filters.ma_cuahang = result?.ma_cuahang;
          this.ten_cuahang = result?.ten_cuahang;
        }
      });
  }

  openSearchShop2Dialog() {
    this.commonService.openDialog(SearchDialogComponent, { dataSource: this.shop, componentName: SEARCH_COMPONENT_NAME.SHOP_INFO })
      .afterClosed().subscribe(result => {
        if (result?.ma_cuahang) {
          this.filters.ma_cuahang2 = result?.ma_cuahang;
          this.ten_cuahang2 = result?.ten_cuahang;
        }
      });
  }

  onBlurDateStart(event: any, ref: any) {
    this.filters.ngay_bd = ref.isoDateString.toString();
  }

  onBlurDateEnd(event: any, ref: any) {
    this.filters.ngay_kt = ref.isoDateString.toString();
  }

  // onEnter(event: any, next_control: any) {
  //   if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
  //     if (next_control)
  //       if (next_control.input)
  //         next_control.input.nativeElement.focus();
  //       else
  //         next_control.focus();
  //   }

  // }
  onEnter(event: any) {
    //event.preventDefault(); // Ngăn chặn hành động mặc định của nút Enter (submit form)
    const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly]):not([disabled]):not([type="date"])');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === event.target) {
        if (i < inputs.length - 1) {
          inputs[i + 1].focus(); // Focus vào phần tử tiếp theo
          inputs[i + 1].setSelectionRange(0, 0); // Đặt con trỏ vào đầu của phần tử
          break;
        }
        else {
          // Phần tử cuối cùng sẽ focus vào button tìm kiếm
          document.getElementById('btn-add')?.focus();
        }
      }
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

