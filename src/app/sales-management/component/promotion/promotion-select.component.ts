import { AfterViewInit, Component, Inject, OnChanges, OnInit } from '@angular/core';
import { DISCOUNT_TYPE, Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountApiService } from '@app/sales-management/api/discount-api.service';
import { Cell } from '../form-control-custom/table-custom/table-custom.component';
import { DISCOUNT_SELECT } from '@app/sales-management/model/common/fields.table';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Platform } from '@angular/cdk/platform';

@Component({
    selector: 'promotion-select',
    templateUrl: './promotion-select.component.html',
    styleUrls: ['./promotion-select.component.scss'],
})
export class PromotionSelectComponent implements OnInit, OnChanges, AfterViewInit {
    itemsSelected: Discount[] = [];
    dataSource!: Discount[];
    columns!: Cell[];
    title!: string;
    isMobile = false;
    constructor(
        public dialogRef: MatDialogRef<PromotionSelectComponent>,
        private platform: Platform,
        @Inject(MAT_DIALOG_DATA) public data: { dataSource: Discount[], currentItem: Discount[] },
    ) {
    }

    ngOnInit(): void {
        console.log('promotion select');

        this.isMobile = this.platform.IOS || this.platform.ANDROID;
        this.columns = DISCOUNT_SELECT as any;
        this.dataSource = this.data.dataSource;
        this.title = 'Danh sách hàng khuyến mại';
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

    }

}

