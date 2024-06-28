import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { convertToSlug, generateStringDatetime } from '@app/_common/commonFunction';
import { Buffer } from 'buffer';
@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.scss']
})
export class PrinterComponent {

  pdfSrc = '';
  pageVariable = 1;
  totalPage = 0;
  zoom = 1;
  rotate = 0;

  constructor(
    public dialogRef: MatDialogRef<PrinterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.pdfSrc = data.pdf;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }


  nextPage() {
    if (this.pageVariable < this.totalPage)
      this.pageVariable++;
  }
  firstPage() {
    this.pageVariable = 1;
  }
  previousPage() {
    if (this.pageVariable > 1)
      this.pageVariable--;
  }
  lastPage() {
    this.pageVariable = this.totalPage;
  }

  afterLoadComplete(pdf: any) {
    this.totalPage = pdf.numPages;
  }

  zoomIn() {
    if (this.zoom < 1) {
      this.zoom += 0.125;
      return;
    }
    if (this.zoom < 2)
      this.zoom += 0.25;
  }
  zoomOut() {
    if (this.zoom > 0.25) {
      if (this.zoom < 1) {
        this.zoom -= 0.125;
        return;
      }
      this.zoom -= 0.25;
    }
  }
  rotateLeft() {
    this.rotate -= 90;
  }

  download() {
    // Array Buffer scenario
    const byteArray = Buffer.from(this.pdfSrc.split(',')[1], 'base64');
    const arrayBuffer = byteArray.buffer;

    // Tạo đối tượng DataView từ ArrayBuffer
    const dataView = new DataView(arrayBuffer);

    const x = new Blob([dataView], { type: 'application/pdf' });
    const a = document.createElement('a');
    // Instead of X use blob if you have it
    a.href = URL.createObjectURL(x);
    const date = new Date();
    const formattedDate = generateStringDatetime(date);
    const fileName = this.data.title + ' - ' + formattedDate + '.pdf';
    a.setAttribute('download', fileName);
    a.click();
  }

  print() {
    const byteArray = Buffer.from(this.pdfSrc.split(',')[1], 'base64');
    const arrayBuffer = byteArray.buffer;

    // Tạo đối tượng DataView từ ArrayBuffer
    const dataView = new DataView(arrayBuffer);
    const blob = new Blob([dataView], { type: 'application/pdf' });
    const element = document.createElement('iframe');   // Create an IFrame.
    element.style.visibility = 'hidden';    // Hide the frame.
    element.src = URL.createObjectURL(blob); // Set source.
    document.body.appendChild(element);  // Add the frame to the web page.
    if (element !== null && element.contentWindow !== null) {
      element.contentWindow.focus();       // Set focus.
      element.contentWindow.print();      // Print it.
    }
    // var wnd = window.open(URL.createObjectURL(x));
    // wnd.print();
  }
  rotateRight() {
    this.rotate += 90;
  }

  pageRendered(e: CustomEvent) {
    //
  }

  textLayerRendered(e: CustomEvent) {
    //
  }

  onFileSelected() {
    const $img: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // console.log(e.target.result);
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer($img.files[0]);
    }
  }
}