import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
})
export class ViewImageComponent {
  imageUrl: string = ''
  constructor(
    public dialogRef: MatDialogRef<ViewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string },
  ) {
  }

  ngOnInit(): void {
    this.imageUrl = this.data.imageUrl || ''
  }

  ngOnChanges(): void {

  }

  ngAfterViewInit() {

  }
}
