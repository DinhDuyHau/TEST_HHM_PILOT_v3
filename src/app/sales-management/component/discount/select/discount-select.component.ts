import { AfterViewInit, Component, Inject, OnChanges, OnInit } from '@angular/core';
import { DISCOUNT_TYPE, Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountApiService } from '@app/sales-management/api/discount-api.service';
import { Cell } from '../../form-control-custom/table-custom/table-custom.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Platform } from '@angular/cdk/platform';

const { DISCOUNT_SELECT } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'discount-select',
  templateUrl: './discount-select.component.html',
  styleUrls: ['./discount-select.component.scss'],
})
export class DiscountSelectComponent implements OnInit, OnChanges, AfterViewInit {
  itemsSelected: Discount[] = [];
  dataSource!: Discount[];
  columns!: Cell[];
  title!: string;
  isMobile = false;
  constructor(
    public dialogRef: MatDialogRef<DiscountSelectComponent>,
    private platform: Platform,
    @Inject(MAT_DIALOG_DATA) public data: { dataSource: Discount[], currentItem: Discount[] },
  ) {
  }

  ngOnInit(): void {
    this.isMobile = this.platform.IOS || this.platform.ANDROID;
    this.columns = DISCOUNT_SELECT as any;
    this.dataSource = this.data.dataSource;
    this.title = 'Danh sách chiết khấu còn hiệu lực có thể áp dụng';
    this.loadDiscountSelected();
  }

  ngOnChanges(): void {

  }

  ngAfterViewInit() {

  }

  loadDiscountSelected() {
    this.itemsSelected = this.data.currentItem;
    const discountCodeSelected = this.itemsSelected.map(e => e.ma_ck?.trim());
    this.dataSource.map((e: any) => {
      if (discountCodeSelected.includes(e.ma_ck?.trim())) {
        e.selected = true;
      }
    });
  }

  onSelect(): void {
    const items = this.dataSource.filter((e: any) => e.selected);
    this.dialogRef.close(items);
  }

  onCancel() {
    this.dialogRef.close();
  }

  handleChangeSelect(discount: any) {
    // const discounts = this.dataSource.filter(x=>x.loai_ck == DISCOUNT_TYPE.ACCESSORY_COMBO);
    // if (discount.selected && discount.loai_ck == DISCOUNT_TYPE.ACCESSORY_COMBO) {
    //   if (!this.markerArray.find(x => x.marker)) {
    //     const detail = discount.details.filter((x: any) => x.stt == 1).sort((a: any, b: any) => {
    //       return (b.tien_ck || b.tien_ck_tl) - (a.tien_ck || a.tien_ck_tl);
    //     });


    //   }
    //   else {
    //     //
    //   }
    // }
    // else {
    //   //
    // }
  }

}

