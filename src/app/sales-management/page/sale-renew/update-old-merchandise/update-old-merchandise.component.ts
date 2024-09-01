import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../common/common.service';


@Component({
  selector: 'app-update-old-merchandise',
  templateUrl: './update-old-merchandise.component.html',
  styleUrls: ['./update-old-merchandise.component.scss']
})
export class UpdateOldMerchandiseComponent implements OnInit {
  title!: string;
  disabled = false;
  readonly = false;
  invalid = false;

  constructor(
    private commonService: CommonService,
    public dialogRef: MatDialogRef<UpdateOldMerchandiseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dataSource: any[], currentItem: any[] },
  ) {
  }

  ngOnInit(): void {
    this.title = 'Sửa thông tin Hàng thu cũ';
  }

  onCancel() {
    this.dialogRef.close();
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

}

