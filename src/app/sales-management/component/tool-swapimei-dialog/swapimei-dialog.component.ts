import { AfterViewInit, Component, Inject, OnChanges, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cell } from '../form-control-custom/table-custom/table-custom.component';
import { Platform } from '@angular/cdk/platform';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { Merchandise } from '@app/sales-management/model/ticket/retail/model';

@Component({
    selector: 'swapimei-dialog',
    templateUrl: './swapimei-dialog.component.html',
    styleUrls: ['./swapimei-dialog.component.scss'],
})
export class SwapImeiDialogComponent implements OnInit, OnChanges, AfterViewInit {
    title!: string;
    isMobile = false;
    itemSelected!: Merchandise;
    new_imei = '';

    constructor(
        public dialogRef: MatDialogRef<SwapImeiDialogComponent>,
        private platform: Platform,
        @Inject(MAT_DIALOG_DATA) public data: { ma_imei: string },
        private imeiApiService: ImeiApiService
    ) {
    }

    ngOnInit(): void {
        this.isMobile = this.platform.IOS || this.platform.ANDROID;
        this.title = 'Thay đổi imei';
    }

    ngOnChanges(): void {

    }

    ngAfterViewInit() {

    }

    changeNewImei(event: string) {
        this.new_imei = event;
    }

    onSelect(): void {
        this.dialogRef.close(this.new_imei);
    }

    onCancel() {
        this.dialogRef.close();
    }

}

