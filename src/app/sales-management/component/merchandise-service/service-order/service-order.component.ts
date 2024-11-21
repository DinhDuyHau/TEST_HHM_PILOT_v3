import { AfterViewInit, Component, Inject, OnChanges, OnInit, ViewEncapsulation, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MerchandiseServiceApiService } from '@app/sales-management/api/merchandiseService-api.service';
import { Cell } from '../../form-control-custom/table-custom/table-custom.component';
import { Service } from '@app/sales-management/model/ticket/common-model/service.model';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../search/serach-dialog.component';
import { ServiceOfMerchandiseService } from '@app/sales-management/page/common/service.service';
import { Customer } from '@app/_components/category/customer/customer.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { Language } from '@app/sales-management/page/common/language';

const { SERVICE_ORDER } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'service-order',
  templateUrl: './service-order.component.html',
  styleUrls: ['./service-order.component.scss'],
})
export class ServiceOrderComponent implements OnInit, OnChanges, AfterViewInit {
  ma_kh = '';
  ten_kh = '';
  gia_ban = 0;
  ma_vt = '';
  columns!: Cell[];
  dataSource: Service[] = [];
  filteredData!: any[];
  title!: string;
  value!: string;
  ma_cuahang!: string;
  preious_quantity: number[] = [];
  dataOrderAdded: Service[] = [];

  constructor(
    public dialogRef: MatDialogRef<ServiceOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      ma_kh: string,
      ten_kh: string,
      ma_cuahang: string,
      dataSource: Service[],
      columns: any,
      title: string
    },
    private merchandiseServiceApiService: MerchandiseServiceApiService,
    private commonService: CommonService,
    private ticketApiService: TicketApiService,
    private serviceOfMerchandiseService: ServiceOfMerchandiseService,
    private customerApiService: CustomerApiService

  ) {
    this.ma_kh = data.ma_kh;
    this.ten_kh = data.ten_kh;
    this.ma_cuahang = data.ma_cuahang;
  }

  ngOnInit(): void {
    this.columns = this.data.columns || SERVICE_ORDER as any as Cell[];
    this.title = this.data.title || 'Chọn dịch vụ trả lại';
    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);
    this.ma_cuahang = userObj['shop'];
    this.dataOrderAdded = this.data.dataSource || [];
    this.filteredData = this.dataSource;

    // when init dialog load orders
    this.filterOrder();
  }

  ngOnChanges(): void {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  onSearch(value: string): void {
    this.commonService.openDialog(SearchDialogComponent, { keyword: value, componentName: SEARCH_COMPONENT_NAME.CUSTOMER })
      .afterClosed().subscribe(result => {
        if (result) {
          this.handleAddCustomer(result);
        }
      });
  }

  openDialogSearch() {
    this.commonService.openDialog(SearchDialogComponent, { keyword: '', componentName: SEARCH_COMPONENT_NAME.CUSTOMER })
      .afterClosed().subscribe(result => {
        if (result) {
          this.handleAddCustomer(result);
        }
      });
  }

  handleAddCustomer(customer: Customer) {
    this.ma_kh = customer.ma_kh;
    this.ten_kh = customer.ten_kh;
  }

  onChangeQuantity(event: { item: any, index: number, value: any, columnName: string }) {
    if (event.item.ad_key) {
      this.merchandiseServiceApiService.getKeyOfService(event.item.ma_dv, +event.value).subscribe((result_key) => {
        if (result_key.success && result_key.result) {
          this.preious_quantity[event.index] = +event.value;
          this.dataSource[event.index].so_luong = +event.value;
          this.dataSource[event.index].thanh_tien = this.dataSource[event.index].gia_ban * event.value;
          this.dataSource[event.index].tien_thue = this.dataSource[event.index].gia_ban * this.dataSource[event.index].so_luong * this.dataSource[event.index].thue_suat;
          this.dataSource[event.index].tong_tien = this.dataSource[event.index].thanh_tien + this.dataSource[event.index].tien_thue;
        }
        else {
          this.dataSource[event.index].so_luong = this.preious_quantity[event.index];
          this.commonService.showMessageByName('not_found_key');
        }
      });
    }
    else {
      this.preious_quantity[event.index] = +event.value;
      this.dataSource[event.index].so_luong = +event.value;
      this.dataSource[event.index].thanh_tien = this.dataSource[event.index].gia_ban * event.value;
      this.dataSource[event.index].tien_thue = this.dataSource[event.index].gia_ban * this.dataSource[event.index].so_luong * this.dataSource[event.index].thue_suat;
      this.dataSource[event.index].tong_tien = this.dataSource[event.index].thanh_tien + this.dataSource[event.index].tien_thue;
    }
  }

  filterOrder() {
    if (!this.ma_kh) {
      this.commonService.showMessageByName('lblWarningNotValidCustomer');
      return;
    }
    this.ticketApiService.getOrdersServiceReturn({ ma_kh: this.ma_kh, ma_cuahang: this.ma_cuahang }).subscribe((result) => {
      if (result && result.success) {
        if (result.result && result.result.length) {
          this.dataSource = result.result;

          // gán dữ liệu cho filteredData
          this.filteredData = [...this.dataSource];
          // load selected
          this.loadSelected(this.dataSource, this.filteredData);
        }
        else {
          this.commonService.showMessageByName('lblWarningNotFoundReturnService');
        }
      }
      else this.commonService.showMessageByName(result.message);
    });
    //
  }
  onSelectItem(item: any) {
    const prime = item.item;
    const detail = prime.items;
    this.dialogRef.close({ prime, detail });
  }
  onRemoveItem(event: { item: Service }) {
    this.dataSource = this.dataSource.filter((e, i) => {
      if (e.ma_dv !== event.item.ma_dv) {
        this.preious_quantity.splice(i, 1);
        return true;
      }
      return false;
    });

  }
  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
      }
    });
  }

  onCancel() {
    this.dialogRef.close(this.dataOrderAdded);
  }

  onSelect() {
    const item = this.filteredData.filter((e: any) => e.selected);

    if (item.length <= 0) {
      this.commonService.showMessage('Vui lòng chọn dịch vụ');
      return;
    }

    this.dialogRef.close(item);
  }

  onItemSelected(selectedItem: any) {
    const foundItem = this.filteredData.find((item) => item === selectedItem);

    if (foundItem) {
      foundItem.selected = foundItem.selected;
    }
  }

  loadSelected(itemsSelected: any, items: any[]) {
    const codeSelected = new Set<string>(
      itemsSelected
        .filter((e: { selected: any; }) => e.selected)
        .map((e: { key: string; }) => e.key?.trim())
        .filter(Boolean)
    );

    items.forEach((e: any) => {
      if (e.selected === true) { }
      e.selected = codeSelected.has(e.key?.trim());
    });

    items.forEach((e: any) => {
      e.selected = this.dataOrderAdded.some(
        (order: Service) =>
          order.key?.trim() === e.key?.trim()
      );
    });
  }

}

