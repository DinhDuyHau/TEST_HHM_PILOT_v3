import { AfterViewInit, Component, Inject, OnChanges, OnInit } from '@angular/core';
import { DISCOUNT_TYPE, Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountApiService } from '@app/sales-management/api/discount-api.service';
import { Cell } from '../../form-control-custom/table-custom/table-custom.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Platform } from '@angular/cdk/platform';
import { CommonService } from '@app/sales-management/page/common/common.service';

const { CRM_SELECT } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'crm-select',
  templateUrl: './crm-select.component.html',
  styleUrls: ['./crm-select.component.scss'],
})
export class CRMSelectComponent implements OnInit, OnChanges, AfterViewInit {
  itemsSelected: any[] = [];
  dataSource!: any[];
  columns!: Cell[];
  title!: string;
  isMobile = false;

  constructor(
    public dialogRef: MatDialogRef<CRMSelectComponent>,
    private discountApiService: DiscountApiService,
    private commonService: CommonService,
    private platform: Platform,
    @Inject(MAT_DIALOG_DATA) public data: { ma_vt: string, ngay_ct: Date, ma_ctr: string },
  ) {
  }

  ngOnInit(): void {
    this.isMobile = this.platform.IOS || this.platform.ANDROID;
    this.columns = CRM_SELECT as any;
    this.title = 'Danh sách chương trình CRM còn hiệu lực có thể áp dụng';
    this.getDiscountCRM();
  }

  ngOnChanges(): void {

  }

  ngAfterViewInit() {

  }

  loadDiscountSelected() {
    this.dataSource.map((e: any) => {
      if (e.ma_ctr == this.data.ma_ctr) {
        e.selected = true;
      }
    });
  }

  onSelect(): void {
    const items = this.dataSource.filter((e: any) => e.selected);
    if (items.length == 0) {
      this.commonService.showMessage('Vui lòng chọn ít nhất một chương trình CRM');
      return;
    }
    this.dialogRef.close(items);
  }

  onCancel() {
    this.dialogRef.close();
  }

  handleChangeSelect(selectedItem: any) {
    this.dataSource.forEach(item => {
      item.selected = (item === selectedItem);
    });
  }

  getDiscountCRM() {
    this.discountApiService.getDiscountCRM(this.data.ma_vt, this.data.ngay_ct)
      .subscribe(res => {
        if (res && res.success) {
          this.dataSource = res.result as any;
          this.loadDiscountSelected();
        }
      });
  }
}

