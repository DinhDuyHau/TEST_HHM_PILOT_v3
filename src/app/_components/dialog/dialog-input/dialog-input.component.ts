import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-input',
  templateUrl: './dialog-input.component.html',
  styleUrls: ['./dialog-input.component.scss']
})
export class DialogInputComponent {
  label = '';
  value = '';
  constructor(
    public dialogRef: MatDialogRef<DialogInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.label = data.label;
    this.value = data.value;
  }
  onClickSave() {
    this.dialogRef.close(this.value);
  }
  onClickClose() {
    this.dialogRef.close(false);
  }
}
