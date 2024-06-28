import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'form-upload-file-custom',
  templateUrl: './form-upload-file-custom.component.html',
  styleUrls: ['./form-upload-file-custom.component.scss']
})
export class FormUploadFileCustomComponent implements OnChanges, OnInit {
  @ViewChild('imguploadfile')
  input!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadfilewrapper')
  uploadfilewrapper!: ElementRef<HTMLInputElement>;
  @Output() fileSelected = new EventEmitter<File>();
  @Input() fileName!: string;
  selectedName: string = '';
  fileNameShow: string = '';

  constructor(private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.fileName) {
      this.fileNameShow = this.fileName.substring(this.fileName.lastIndexOf('/') + 1);
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const selectedFile: File = files[0];
      this.selectedName = selectedFile.name;
      this.fileSelected.emit(selectedFile);
    }
  }

  openUploadFile() {
    this.input.nativeElement.click();
  }

  handleOver(event: any) {
    event.preventDefault();
    // this.uploadfilewrapper.nativeElement.style.opacity = '0.8'
  }

  drop(event: any) {
    event.preventDefault();
    const data = event.dataTransfer.files[0];
    this.selectedName = data.name;
    this.fileSelected.emit(data);

  }
}


