import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import dataFormat from '@app/_common/dataFormat';
import { DataFormatPipe } from '@app/_pipe/dataFormat/data-format.pipe';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { LookupApiService } from '@app/sales-management/api/lookup-api.service';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'form-input-custom',
  templateUrl: './form-input-custom.component.html',
  styleUrls: ['./form-input-custom.component.scss']
})
export class FormInputCustomComponent implements OnChanges, OnInit {
  @Output() handleEnterInput = new EventEmitter<any>();
  @Output() handleClickSearch = new EventEmitter<any>();
  @Output() handleClickOpenDialog = new EventEmitter<any>();
  @Output() handleClickUploadImage = new EventEmitter<any>();
  @Output() handleUploadImage = new EventEmitter<any>();
  @Output() handleUViewPhoto = new EventEmitter<any>();
  @Output() handleClickCodeScanner = new EventEmitter<any>();
  @Output() handleBlur = new EventEmitter<any>();
  @Output() handleChangeValue = new EventEmitter<any>();

  @Input() align!: string;
  @Input() value: any;
  @Input() name!: string;
  @Input() label!: string;
  @Input() codeScanner = false;
  @Input() uploading = false;
  @Input() isEye = false;
  @Input() uploadImage = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() tabIndex!: number;
  @Input() format = '';
  @Input() dataType = 'text';
  @Input() invalid = false;
  @Input() type = 'text';

  @Input() isLookup = false;
  @Input() controller = '';

  @ViewChild('ref') input!: ElementRef;

  dataFormat = dataFormat;

  constructor(private dialog: MatDialog,
    private renderer: Renderer2,
    private commonService: CommonService,
    private lookupService: LookupApiService
  ) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.value = this.formatValue(this.value);
  }

  async onBlur(value: string) {
    let item: any = null;
    if (this.isLookup && this.controller && this.controller !== '') {
      this.lookupService.controller = this.controller;
      (await this.lookupService.getOneById(value)).subscribe((result: any) => {
        if (result.success && result.result) {
          item = result.result;
          this.handleBlur.emit(item);
        }
        else {
          this.commonService.showMessage('Mã không tồn tại trong danh mục');
        }
      });
    }
  }

  onClickSearch() {
    this.handleClickSearch.emit();
  }

  openDialog() {
    this.handleClickOpenDialog.emit();
  }

  openUploadImage() {
    this.handleClickUploadImage.emit();
  }

  onClickCodeScanner() {
    this.handleClickCodeScanner.emit();
  }

  onClickUploadImage() {
    this.handleUploadImage.emit();
  }

  onClickUViewPhoto() {
    this.handleUViewPhoto.emit();
  }

  onChangeValue() {
    let value = this.value;
    if (this.dataType === 'number') {
      value = (this.value.toString().includes('-') ? '-' : '') + this.value.toString().replace(/\D/g, '') || '0';
      value = parseInt(value);
    }
    this.handleChangeValue.emit(value);
  }

  focus() {
    (this.input.nativeElement as HTMLInputElement).focus();
  }

  onEnter(event: any) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
      let value = this.value;
      if (this.dataType === 'number') {
        value = (this.value.toString().includes('-') ? '-' : '') + this.value.toString().replace(/\D/g, '') || '0';
        value = parseInt(value);
      }
      this.focusNext(event.target);
      // this.moveToNext(event);
      this.handleEnterInput.emit(value);
    }
  }

  moveToNext(event: any) {
    let next = event.target.nextElementSibling;
    if (next) {
      next.focus();
    } else {
      event.target.blur();
    }
  }

  focusNext(input: any) {
    const currentNode = input;
    const container = currentNode.closest('.ticket-container');
    const filter_container = currentNode.closest('.adv-search-form-box');

    if (!container && !filter_container) {
      return;
    }

    const inputs = container ? container.querySelectorAll('input') : (filter_container ? filter_container.querySelectorAll('input') : null);
    if (!inputs)
      return;

    let foundCurrentInput = false;
    let nextInput = null;
    for (let i = 0; i < inputs.length; i++) {
      if (foundCurrentInput && !inputs[i].readOnly && !inputs[i].disabled) {
        nextInput = inputs[i];
        break;
      }
      if (inputs[i] === currentNode) {
        foundCurrentInput = true;
      }
    }
    if (nextInput)
      nextInput.focus();
  }
  onInput(ref: any) {
    const value = this.formatValue(ref.value);
    this.value = value;
    ref.value = value;
  }
  onFocus(inputElement: any) {
    if (this.value == 0) {
      this.renderer.selectRootElement(inputElement).select();
    }
  }
  formatValue(value: any) {
    const dataFormatPipe = new DataFormatPipe();
    const format = (dataFormat as any)[this.format];

    if (format && value) {
      return dataFormatPipe.transform(value, this.dataType, format);
    } else if (this.dataType === 'number') {
      return (this.value.toString().includes('-') ? '-' : '') + value.toString().replace(/\D/g, '') || '0';
    }
    else {
      return value;
    }
  }
}


