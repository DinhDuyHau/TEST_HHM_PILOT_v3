import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemService } from '@app/_components/lookup/item/item.service';
import { AuthenticationService } from '@app/_services';
import { IMEIService } from '@app/_services/imei.service';
import { Cell } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.component';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { lastValueFrom } from 'rxjs';
const { IMEI_EXPORT_SEARCH } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-search-imei-warranty',
  templateUrl: './search-imei-warranty.component.html',
  styleUrls: ['./search-imei-warranty.component.scss']
})
export class SearchImeiWarrantyComponent implements OnInit {
  columns!: Cell[];
  dataSource!: any[];
  currentItem!: any[];
  filteredData!: any[];
  page_index = 1;
  page_size = 10;
  recordCount = 0;
  imei_xuat = '';
  ma_cuahang = '';
  item_code = '';
  isLoading = false;
  disabled = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { imei_nhap: string },
    public dialogRef: MatDialogRef<SearchImeiWarrantyComponent>,
    private authenticateService: AuthenticationService,
    private imeiService: IMEIService,
    public itemService: ItemService,
    private commonService: CommonService,
  ) {
    this.dataSource = [];
  }

  ngOnInit(): void {
    this.columns = IMEI_EXPORT_SEARCH as any;
    this.filteredData = this.dataSource;
    this.dataSource = this.filteredData.slice(0, 10);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSelect(): void {
    if(!this.item_code) {
      this.commonService.showMessage('Vui lòng chọn mã hàng');
      return;
    }

    const item = this.filteredData.filter((e: any) => e.selected);

    // kết quả trả lại form create
    const result = {
      item: item,
      item_code: this.item_code,
    };

    this.dialogRef.close(result);
  }

  async onEnterImeiXuat(event: any) {
    event.preventDefault();

    if(event.target.value.length < 5) {
      this.commonService.showMessage('Imei xuất cần ít nhất 5 ký tự để tìm kiếm');
      return;
    }

    if(!event.target.value) {
      this.commonService.showMessage('Vui lòng nhập imei tìm kiếm');
      return;
    }

    // reset mảng dữ liệu trước khi search
    this.dataSource = [];

    this.imei_xuat = event.target.value;

    // Chờ kết quả từ hàm tìm kiếm
    await this.onSearchImeiExport();
    this.loadSelected(this.dataSource, this.filteredData);

    this.filteredData = [...this.dataSource];

    this.loadData();
  }

  async onSearchImeiExport() {
    const user = this.authenticateService.userValue;
    this.ma_cuahang = user?.shop ?? '';

    // tìm kiếm imei xuất
    let result = await lastValueFrom(this.imeiService.searchImeiWarranty(this.imei_xuat, this.ma_cuahang));

    if (result && Array.isArray(result.result)) {
      result.result.forEach((item: any) => {
        let ma_imei = item.ma_imei;
        let so_ct_px = item.so_ct_px;
        let ma_vt = item.ma_vt;
        let ten_vt = item.ten_vt;
        let ngay_ct_px = item.ngay_ct_px;

        this.addItem(ma_imei, so_ct_px, ngay_ct_px, ma_vt, ten_vt);
      });
    } else {
      this.commonService.showMessage('Không tìm thấy kết quả phù hợp');
    }

  }

  addItem(ma_imei: string, so_ct_px?: string, ngay_ct_px?: Date, ma_vt?: string, ten_vt?: string) {
    this.dataSource.push({
      ma_imei,
      so_ct_px,
      ngay_ct_px,
      ma_vt,
      ten_vt,
    });
  }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  loadSelected(itemsSelected: any, items: any[]) {
    const debtCodeSelected = new Set<string>(
      itemsSelected
        .filter((e: { selected: any; }) => e.selected)
        .map((e: { stt_rec_px: string; }) => e.stt_rec_px?.trim())
        .filter(Boolean)
    );
    items.forEach((e: any) => {
      if (e.selected === true) { }
      e.selected = debtCodeSelected.has(e.stt_rec_px?.trim());
    });
  }

  loadData() {
    // Reset lại dataSource để tránh lưu trữ các bản ghi cũ trước đó
    this.dataSource = [];

    // Kiểm tra và lọc lại dữ liệu theo page_index và page_size
    const startIdx = (this.page_index - 1) * this.page_size;
    const endIdx = startIdx + this.page_size;

    // Slice từ filteredData để lấy đúng số bản ghi cho trang hiện tại
    this.dataSource = this.filteredData.slice(startIdx, endIdx);
    this.recordCount = this.filteredData.length; // Tổng số bản ghi đã lọc
  }

  onChangePage(event: number) {
    if (event !== this.page_index) {
      this.page_index = event
      this.loadData()
    }
  }

  onChangePageSize(event: string) {
    this.page_size = +event;
    this.page_index = 1;
    this.loadData()
  }

  onItemSelected(selectedItem: any) {
    this.item_code = selectedItem.ma_vt;

    this.filteredData.forEach((item) => {
      item.selected = item === selectedItem;
    });
  }
}
