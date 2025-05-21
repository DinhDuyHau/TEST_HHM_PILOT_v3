import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-input',
  templateUrl: './dialog-input-custom.component.html',
  styleUrls: ['./dialog-input-custom.component.scss']
})
export class DialogInputCustomComponent {
  fields: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogInputCustomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.fields = data.fields || [];
  }
  onClickSave() {
    this.dialogRef.close(this.fields);
  }
  onClickClose() {
    this.dialogRef.close(false);
  }
}
