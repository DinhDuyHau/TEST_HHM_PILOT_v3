import { Component, Input, ElementRef, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomerService } from '@app/_components/category/customer/customer.service';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import dataFormat from '@app/_common/dataFormat';
import { formatData, isFloat } from '@app/_common/commonFunction';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, OnChanges {

  @ViewChild('input') input!: ElementRef;

  @Input('lookup') lookup!: boolean;
  @Input('type') type = 'text';
  @Input('align') align!: string;
  @Input('dataFormatString') dataFormatString!: string;
  @Input('name') name!: string;
  @Input('control') control!: any;
  @Input('readonly') readonly!: boolean;
  @Input('reference') reference!: any;
  @Input('value') value = '';
  @Input('invalid') invalid = false;
  @Output() handleEnter = new EventEmitter<any>();
  @Output() handleChange: EventEmitter<string> = new EventEmitter<string>();

  status = true;
  previousValue!: string;
  constructor(public dialog: MatDialog,
    public customerService: CustomerService,
    private el: ElementRef,
    private decimalPipe: DecimalPipe
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.previousValue = this.value;
      if ((changes['value'].previousValue === null) && this.lookup) {
        this.onBlur('');
      }
    }
  }
  ngOnInit(): void {
    // console.log(this.dataFormatString);
  }
  onBlur($event: any) {
    if (this.lookup && this.value) {
      if (this.control)
        this.control.getItem(this.value).subscribe((res: any) => {
          if (res && res.length != 0) {
            this.reference.forEach((item: any) => {
              item.value = res[item.name] || '';
              this.handleChange.emit(this.value);
            });
          }
        });
      else
        console.error(`control của ${this.name} không được để trống`);
    }
    // else if (!this.lookup) {
    //   this.value = this.inputValue;
    // }
  }
  onFocus($event: any) {
    // this.value = this.inputValue.replaceAll(' ', '');
  }
  onEnter(event: any) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      if (this.lookup) {
        if (this.control)
          this.control.getItem(this.value || '').subscribe((res: any) => {
            if (res && res.length != 0) {
              this.reference.forEach((item: any) => {
                item.value = res[item.name] || '';
                this.handleChange.emit(this.value);
              });
            }
          });
        else
          console.error(`control của ${this.name} không được để trống`);
      }
      this.handleEnter.emit(event);
      // const form = this.el.nativeElement.closest('form');
      // const inputs = form.querySelectorAll('input:not([readonly])');

      // for (let i = 0; i < inputs.length; i++) {
      //   if (inputs[i] === event.target) {
      //     if (i < inputs.length - 1) {
      //       inputs[i + 1].focus(); // Focus vào phần tử tiếp theo
      //       break;
      //     }
      //   }
      // }
    }
  }

  onFilter() {
    if (this.control) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '100%';
      dialogConfig.height = '90%';
      dialogConfig.disableClose = true;
      dialogConfig.data = {
        service: this.control
      };
      const dialogRef = this.dialog.open(LookupComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.reference.forEach((item: any) => {
            item.value = result[item.name] || '';
            this.handleChange.emit(this.value);
          });
        }
      });
    }
    else {
      console.error(`control của ${this.name} không được để trống`);
    }
  }
  // onChange($event: any) {
  //   const newValue = $event.target.value;
  //   this.value = formatData(newValue, this.type, this.dataFormat);
  //   this.change.emit(this.value);
  //   // switch (this.dataFormat) {
  //   //   case dataFormat.upperCaseFormat:
  //   //     this.value = newValue.toUpperCase();
  //   //     break;
  //   //   default:
  //   //     break;
  //   // }
  // }
  onInputChange($event: any) {
    // console.log($event);

    // if (isFloat($event))
    this.handleChange.emit(this.value);
  }
  onValueChange($event: string) {
    if (this.type === 'number' && !isFloat($event) && $event) {
      this.input.nativeElement.value = this.previousValue;
      this.value = this.previousValue;
      this.handleChange.emit(this.previousValue);
    }
    else
      this.handleChange.emit(this.value);
  }
}
