import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Platform } from '@angular/cdk/platform';

@Component({
    selector: 'app-old-product-dialog',
    templateUrl: './old-product-dialog.component.html',
    styleUrls: ['./old-product-dialog.component.scss'],
})
export class OldProductDialogComponent implements OnInit {
    @ViewChild('form') form!: ElementRef;
    isMobile = false;
    currentItem!: any;
    supplier_id = '';
    gia_dc = 0;

    constructor(
        public dialogRef: MatDialogRef<OldProductDialogComponent>,
        private platform: Platform,
        @Inject(MAT_DIALOG_DATA) public data: { supplierId: string, currentItem: any },
    ) {
        this.currentItem = data.currentItem;
        this.gia_dc = data.currentItem.gia_ban;
        this.supplier_id = data.supplierId;
    }
    ngOnInit(): void {

    }

    changePrice(event: any) {
        this.gia_dc = event;
    }

    onCancel() {
        this.dialogRef.close();
    }

    onSave(): void {
        this.currentItem.gia_dc = this.gia_dc;
        this.dialogRef.close(this.currentItem);
    }
}

