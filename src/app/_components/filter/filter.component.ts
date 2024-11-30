import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Control, Filter } from './filter.model';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getDate, getFirstDayOfMonth, getLastDayOfMonth } from '@app/_common/commonFunction';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { Platform } from '@angular/cdk/platform';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @ViewChild('form') form!: ElementRef;

  controls: Control[][];
  [key: string]: any;
  filter: any = {
    tu_ngay: localStorage.getItem('tu_ngay') || getFirstDayOfMonth(new Date()),
    den_ngay: localStorage.getItem('den_ngay') || getLastDayOfMonth(new Date())
  };
  externalKey: string[] = [];
  submit = false;
  isMobile = false;
  formControlName: any = [];
  isChoose = false;

  constructor(public dialogRef: MatDialogRef<FilterComponent>,
    private platform: Platform,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private snackBar: MatSnackBar, private authenticate: AuthenticationService) {
    let i = 0;
    this.controls = data.controls;
    this.controls.forEach(control => {
      control.forEach(item => {
        if (item.isChoose && item.isChoose == true) {
          this.isChoose = item.isChoose;
        }
        if (item.value) {
          if (item.type == 'date') {
            if (item.value == 'new Date()') {
              item.value = getDate(new Date());
              this.filter[item.name] = getDate(new Date());
            }
          }
          else if (item.value.includes('@@')) {
            const name = item.value.replace('@@', '');
            if (this.authenticate.userValue) {
              const value = this.authenticate.userValue[name];
              item.value = value;
              this.filter[item.name] = value;
            }
          }
        }
        if (item.isExternalField)
          this.externalKey.push(item.name || '');

        this.formControlName?.push({ id: i, name: item.name, type: item.type });
        i++;
      });
    });

  }
  ngOnInit(): void {
    this.isMobile = this.platform.IOS || this.platform.ANDROID;
  }
  onSave() {
    this.submit = true;
    let flag = false;
    this.controls.forEach((item) => {
      item.forEach((res) => {
        if (res.required && !this.filter[res.name]) {
          this.snackBar.open('Bạn phải nhập thông tin yêu cầu', 'Đóng', { duration: 5000 });
          flag = true;
          return;
        }
      });
    });
    if (!flag) {
      this.dialogRef.close(this.filter);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onEnter(event: any) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của nút Enter (submit form)
    const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly]):not([disabled]):not([type="date"])');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === event.target) {
        if (i < inputs.length - 1) {
          inputs[i + 1].focus(); // Focus vào phần tử tiếp theo
          break;
        }
        else {
          //phần tử cuối cùng sẽ focus vào button tìm kiếm
          document.getElementById('btn-filter-add')?.focus();
        }
      }
    }
  }
  handleInputChange(controlName: string, $event: any): void {
    if ($event && typeof $event !== 'string') {
      $event = $event.target.value;
    }
    this.filter[controlName] = $event;
  }
  handleInputLookupChange($event: any): void {
    $event.forEach((item: any) => {
      this[item.control] = item.value;
      if (this.externalKey.find((x) => { return x == item.control; }) == undefined) {
        this.filter[item.control] = item.value;
      }
    });
  }

  onBlurDateStart(event: any, ref: any, controlName: string) {
    this.filter[controlName] = ref.isoDateString.toString();
  }

  onEnterDate(event: any, controlName: string) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13)
      this.onEnter(event);
  }
  handleCheck(event: any) {
    console.log(event.source.name)
    this.controls.flat().find((item: any) => {
      if (item.name === event.source.name) {
        if (event.checked === true) {
          this.controls.flat().find((e: any) => {
            if (e.name === item.linkName) {
              e.hidden = false;
            }
          })
        }
        else {
          this.filter[item.linkName] = '';
          this.controls.flat().find((e: any) => {
            if (e.name === item.linkName) {
              e.hidden = true;
            }
          })
        }
      }
    })
  }

}
