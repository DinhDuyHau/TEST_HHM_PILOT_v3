import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import dataFormat from '@app/_common/dataFormat';
import { DataFormatPipe } from '@app/_pipe/dataFormat/data-format.pipe';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'form-payment-custom',
  templateUrl: './form-payment-custom.component.html',
  styleUrls: ['./form-payment-custom.component.scss']
})
export class FormPaymentCustomComponent implements OnChanges, OnInit {
  @Output() handleEnterInput = new EventEmitter<any>();
  @Output() handleClickOpenDialog = new EventEmitter<any>();

  @Input() value: any;
  @Input() max!: number;
  @Input() align!: string;
  @Input() name!: string;
  @Input() label!: string;
  @Input() format!: string;
  @Input() dataType = 'text';
  @Input() selected = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() invalid = false;
  @Input() highlightText = false;
  @Input() highlightBox = false;

  @Output() handleChangeValue = new EventEmitter<any>();


  dataFormat = dataFormat;

  dropdown = false;


  constructor(private dialog: MatDialog,
    private commonService: CommonService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.value = this.formatValue(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.value = this.formatValue(this.value);
  }

  onChange() {
    let value = this.value;
    if (this.dataType === 'number') {
      value = this.value.toString().replace(/\D/g, '') || '0';
      value = parseInt(value);
      if (this.max !== undefined && this.max !== null && value > this.max) {
        this.value = this.formatValue(this.max);
        value = this.max;
        this.commonService.showMessageByContent('Không được nhập quá ' + this.formatValue(this.max));
      }
    }
    this.handleChangeValue.emit(value);
  }

  onEnter(event: any) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      let value = this.value;
      if (this.dataType === 'number') {
        value = this.value.toString().replace(/\D/g, '') || '0';
        value = parseInt(value);
        if (this.max !== undefined && this.max !== null && value > this.max) {
          this.value = this.formatValue(this.max);
          value = this.max;
          this.commonService.showMessageByContent('Không được nhập quá ' + this.formatValue(this.max));
        }
        this.focusNext(event.target);

      }
      this.handleEnterInput.emit(value);
    }
  }
  focusNext(input: any) {
    const currentNode = input;
    const container = currentNode.closest('.ticket-container');
    if (!container) {
      return;
    }
    const inputs = container.querySelectorAll('input');
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

  onFocus(inputElement: any) {
    if (this.value == 0) {
      this.renderer.selectRootElement(inputElement).select();
    }
  }

  openDialog() {
    this.handleClickOpenDialog.emit();
  }

  handleDropdown(name: string) {
    this.dropdown = !this.dropdown;
  }

  onInput(ref: any) {
    const value = this.formatValue(ref.value);
    this.value = value;
    ref.value = value;
  }

  formatValue(value: any) {
    const dataFormatPipe = new DataFormatPipe();
    const format = (dataFormat as any)[this.format];

    if (format && value) {
      return dataFormatPipe.transform(value, this.dataType, format);
    } else if (this.dataType === 'number') {
      return value.toString().replace(/\D/g, '') || '0';
    }
    else {
      return value;
    }
  }

}


