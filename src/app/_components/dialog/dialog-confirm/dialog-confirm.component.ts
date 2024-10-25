import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent {
  title = 'Bạn có chắc không?';
  style_css = '';

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data && data.title && data.title !== '') {
      this.title = data.title;
    }
    this.style_css = data && data.style_css ? data.style_css : '';
  }

  onClickConfirm() {
    this.dialogRef.close(true);
  }
  onClickClose() {
    this.dialogRef.close(false);
  }
}
