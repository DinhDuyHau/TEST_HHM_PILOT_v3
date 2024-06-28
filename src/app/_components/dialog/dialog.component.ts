import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LookupComponent } from '../lookup/lookup.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  title = '';
  constructor(
    public dialogRef: MatDialogRef<LookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.title = data.title;
  }
  onClickDelete() {
    this.dialogRef.close(true);
  }
  onClickClose() {
    this.dialogRef.close(false);
  }
}
