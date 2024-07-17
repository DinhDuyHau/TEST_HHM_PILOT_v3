import { AfterViewInit, Component, Inject, OnChanges, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cell } from '../form-control-custom/table-custom/table-custom.component';
import { Platform } from '@angular/cdk/platform';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { Merchandise } from '@app/sales-management/model/ticket/retail/model';

const { MERCHANDISE_PROMOTION_LIST } = require('@assets/fields/grid/sales-fields-table.json');
@Component({
    selector: 'promotion-select',
    templateUrl: './promotion-select.component.html',
    styleUrls: ['./promotion-select.component.scss'],
})
export class PromotionSelectComponent implements OnInit, OnChanges, AfterViewInit {
    dataSource!: Merchandise[];
    columns!: Cell[];
    title!: string;
    isMobile = false;
    itemSelected!: Merchandise;
    constructor(
        public dialogRef: MatDialogRef<PromotionSelectComponent>,
        private platform: Platform,
        @Inject(MAT_DIALOG_DATA) public data: { ma_vt: string, ma_imei: string, ma_ck: string, rec: number },
        private imeiApiService: ImeiApiService
    ) {
    }

    ngOnInit(): void {
        this.isMobile = this.platform.IOS || this.platform.ANDROID;
        this.columns = MERCHANDISE_PROMOTION_LIST as any;
        this.title = 'Danh sách hàng khuyến mại';
        this.loadData();
    }

    ngOnChanges(): void {

    }

    ngAfterViewInit() {

    }

    loadData() {
        this.imeiApiService.getImeiChangeGiftPromotions(this.data.ma_imei, this.data.ma_ck, this.data.rec)
            .subscribe(result => {
                const data = result?.result.filter(e => e.ma_vt !== this.data.ma_vt)
                this.dataSource = data as any || [];
            })
    }

    handleSelectRow(event: { item: any }) {
        this.itemSelected = event.item;
    }

    onSelect(): void {
        this.dialogRef.close(this.itemSelected);
    }

    onCancel() {
        this.dialogRef.close();
    }

}

