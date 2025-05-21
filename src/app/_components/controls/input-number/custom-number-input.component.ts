import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-number-input',
  templateUrl: './custom-number-input.component.html',
  styleUrls: ['./custom-number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomNumberInputComponent),
      multi: true
    }
  ]
})
export class CustomNumberInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() value: number = 0;
  @Input() dataFormatString: string = 'normalQuantity';
  @Input() type: string = 'number';
  @Input() align: string = 'right';
  @Input() readonly: boolean = false;
  @Input() decimalPlaces: number = 2;

  @Output() handleChange = new EventEmitter<number>();

  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef;

  constructor() {}

  formatNumber(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: this.decimalPlaces,
      maximumFractionDigits: this.decimalPlaces
    });
  }

  onInput(event: any) {
    let inputElement = event.target;
    let cursorPosition = inputElement.selectionStart;

    let rawValue = inputElement.value.replace(/,/g, '');
    let numberValue = parseFloat(rawValue);

    if (!isNaN(numberValue)) {
      this.value = parseFloat(numberValue.toFixed(this.decimalPlaces));
      inputElement.value = this.formatNumber(this.value);
      inputElement.selectionStart = inputElement.selectionEnd = cursorPosition;
      this.handleChange.emit(this.value);
    } else {
      inputElement.value = '';
      this.value = 0;
    }
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value || 0;
    if (this.inputElement) {
      this.inputElement.nativeElement.value = this.formatNumber(this.value);
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.readonly = isDisabled;
  }

  private onChange: any = () => {};
  private onTouched: any = () => {};
}
