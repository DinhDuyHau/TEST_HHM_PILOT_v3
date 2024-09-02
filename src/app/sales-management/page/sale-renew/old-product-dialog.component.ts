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
    currentItem!: any[];

    constructor(
        public dialogRef: MatDialogRef<OldProductDialogComponent>,
        private platform: Platform,
        @Inject(MAT_DIALOG_DATA) public data: { currentItem: any[] },
    ) {
    }
    ngOnInit(): void {
        console.log(this.data)
    }

    onCancel() {
        this.dialogRef.close(this.currentItem);
    }

    onSave(): void {
        console.log('check for save')

        this.dialogRef.close();
    }
}

