import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import button from '@app/_common/button';
import { getResource, isFloat } from '@app/_common/commonFunction';
import dataFormat from '@app/_common/dataFormat';
import { CategoryService } from '@app/_components/category/category.service';
import { CustomerService } from '@app/_components/category/customer/customer.service';
import { Button, ItemFilter } from '@app/_components/gridV2/grid.model';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { LookupV2Component } from '@app/_components/lookupV2/lookup-v2.component';
import { LookupData } from '@app/_components/lookupV2/lookup-v2.model';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { Result } from '@app/_models/Result';
import { DataFormatPipe } from '@app/_pipe/dataFormat/data-format.pipe';
import { AuthenticationService } from '@app/_services';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Exception } from '@zxing/library';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, lastValueFrom, map, of, switchMap } from 'rxjs';
@Component({
  selector: 'app-input-custom-v2',
  templateUrl: './input-custom-v2.component.html',
  styleUrls: ['./input-custom-v2.component.scss']
})
export class InputCustomV2Component implements OnChanges, OnInit {
  @Output() handleEnter = new EventEmitter<any>();
  @Output() handleChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() handleChangeLookup: EventEmitter<{ control: string, value: any }[]> = new EventEmitter<{ control: string, value: any }[]>();
  @Output() handleScanner: EventEmitter<string> = new EventEmitter<string>();
  @Output() handleAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() handleButton = new EventEmitter<string>();
  @Output() handleUploadImage = new EventEmitter<any>();
  @Output() handleUViewPhoto = new EventEmitter<any>();
  @Output() handleChangeResponse: EventEmitter<any> = new EventEmitter<any>();

  @Input() align!: string;
  @Input() value: any;
  @Input() name!: string;
  @Input() type = 'text';
  @Input() label!: string;
  @Input() codeScanner = false;
  @Input() action = false;
  @Input() titleButton = 'Thực hiện';
  @Input() uploading = false;
  @Input() isEye = false;
  @Input() uploadImage = false;
  @Input() disabled = false;
  @Input() tabIndex!: number;
  @Input() buttons: Button[] = [];
  @Input() filter: ItemFilter[] = [];
  @Input() filterOther: any;

  @ViewChild('ma') input!: ElementRef;

  @Input('lookup') lookup!: boolean;
  @Input('dataFormatString') dataFormatString!: string;
  @Input('control') control!: any;
  @Input('readonly') readonly!: boolean;
  @Input('reference') reference!: any;
  @Input('mapper') mapper!: any;
  @Input('invalid') invalid = false;
  @Input('isChoose') isChoose!: boolean;

  status = true;
  previousValue!: string;

  //#region  search
  pageIndex = 0;
  pageSize = 20;
  pageCount = 0;
  totalItems = 0;
  withRefresh = false;
  searchResult: any[] = [];
  private searchText$ = new Subject<string>();

  //#endregion


  constructor(private dialog: MatDialog, private http: HttpClient, private categoryService: CategoryService, private authenticate: AuthenticationService, private renderer: Renderer2,
  ) {

  }

  ngOnInit(): void {
    this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(packageName => {
        return this.onQuickSearch(packageName);
      })
    ).subscribe(result => {
      result.subscribe((res: any) => {
        if (this.withRefresh) {
          this.searchResult = [];
          return;
        }
        if (res.success && res.result && res.result.items) {
          this.searchResult = res.result.items;
          this.pageSize = res.result.pageSize;
          this.pageCount = res.result.pageCount;
          this.totalItems = res.result.recordCount;

        }
      });
    });
    //
  }
  onChange() {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.value = this.formatValue(this.value);
      this.previousValue = this.value;
      // if ((changes['value'].previousValue === null) && this.lookup) {
      //   this.onBlur('');
      // }
    }
  }

  async onBlur($event: any) {
    this.withRefresh = true;
    setTimeout(() => {
      this.searchResult = [];

    }, 100);
    if (this.lookup && this.value) {
      if (this.control && typeof this.control == 'object')
        this.control.getItem(this.value).subscribe((res: any) => {
          if (res) {
            if (res.success && res.result && res.result.items && res.result.items.length > 0) {
              this.handleChangeResponse.emit(res);
            }
            else {
              const list_control: { control: any; value: any; }[] | undefined = [];
              this.reference.forEach((item: any) => {
                if (typeof item == 'object') {
                  item.value = res[item.name] || (typeof (res[item.name]) == 'boolean' ? false : '');
                  // this.handleChangeLookup.emit({});
                  list_control.push({ control: item.name, value: item.value });
                }
                else {
                  if (this.mapper) {
                    list_control.push({ control: this.mapper[item], value: res[item] || (typeof (res[item.name]) == 'boolean' ? false : '') });
                  }
                  else {
                    list_control.push({ control: item, value: res[item] || (typeof (res[item.name]) == 'boolean' ? false : '') });
                  }
                }
              });
              this.handleChange.emit(this.value);
              this.handleChangeLookup.emit(list_control);
              this.handleChangeResponse.emit(res);
            }

          }
        });
      else if (typeof this.control == 'string') {
        const randomParam = new Date().getTime();
        const res = await lastValueFrom(this.http.get<LookupData>(`assets/control-lookup/${this.control}.json?r=${randomParam}`).pipe(
          catchError((error: any) => {
            return of(false);
          }),
          map((res) => {
            return res;
          })));

        if (typeof res == 'object') {
          res.filter = res.filter.map((item) => {
            if ((item.value as string).includes('@@')) {
              const name = (item.value as string).replace('@@', '');
              if (this.authenticate.userValue) {
                const value = this.authenticate.userValue[name];
                return { ...item, value: value };
              }
              return { ...item, operator: 'like', value: '%%' };
            }
            else if ((item.value as string).includes('@')) {
              const name = (item.value as string).replace('@', '');
              const value = this.filterOther[name];
              if (value) {
                return { ...item, value: value };
              }
              return { ...item, operator: 'like', value: '%%' };
            }
            return item;
          });

          let name = this.name;
          if (this.mapper) {
            for (const [key, value] of Object.entries(this.mapper)) {
              if (value == this.name) {
                name = key;
              }
            }
          }
          res.filter = [...res.filter, ...this.filter, { name: name, operator: '=', value: this.value.trim() }];
          const list_control: { control: any; value: any; }[] | undefined = [];
          this.categoryService.initData(res.entity, res.title, res.entity);
          this.categoryService.getItems({ pageIndex: 0, pageSize: 1 }, res.filter, { name: '', direction: 'asc' }).subscribe((result => {
            if (result && result.result && result.result.items) {
              const response = result.result.items[0];
              if (!response) return;
              this.reference.forEach((item: any) => {
                if (typeof item == 'object') {
                  item.value = response[item.name] || (typeof (response[item.name]) == 'boolean' ? false : '');
                  // this.handleChangeLookup.emit({});
                  list_control.push({ control: item.name, value: item.value });
                }
                else {
                  if (this.mapper) {
                    list_control.push({ control: this.mapper[item], value: response[item] || (typeof (response[item.name]) == 'boolean' ? false : '') });
                  }
                  else {
                    list_control.push({ control: item, value: response[item] || (typeof (response[item.name]) == 'boolean' ? false : '') });
                  }

                }
              });
              this.handleChange.emit(this.value);
              this.handleChangeLookup.emit(list_control);
            }
          }));
        }
      }
      else {
        console.error(`control của ${this.name} không được để trống`);
      }
    }
    // else if (!this.lookup) {
    //   this.value = this.inputValue;
    // }
  }
  onBlurDate($event: any) {
    const time = $event.target.value.split('/');
    if (time.length !== 3) {
      this.handleChange.emit('');
      return;
    }
    const dateString = time[2] + '-' + time[1] + '-' + time[0];
    if (!this.checkValidDate(dateString)) {
      this.value = '';
      this.handleChange.emit('');
    }
    else {
      this.handleChange.emit(dateString);
    }
  }
  onFocus(inputElement: any) {
    if (this.value == 0) {
      this.renderer.selectRootElement(inputElement).select();
    }
  }
  onEnterDate(event: any) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault();
      this.onBlurDate(event);
      this.focusNext(event.target);
    }
  }

  onKeyUp(event: any) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault();
      // this.onBlur(event);
      this.focusNext(event.target);
      this.handleEnter.emit(event);
    }
    else {
      // this.search(this.getValue(event));
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

  checkValidDate(dateString: string) {
    const dateObj = new Date(dateString);
    return dateObj.toString() !== 'Invalid Date';
  }
  async onFilter() {
    if (this.control) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '100%';
      dialogConfig.height = '90%';
      dialogConfig.disableClose = true;
      dialogConfig.data = {
        service: this.control
      };
      let dialogRef;
      if (typeof this.control == 'object') {
        if (this.filter && this.filter.length > 0) {
          if (!this.control.filter) { this.control.filter = []; }
          this.control.filter = [...this.filter];
        }
        dialogRef = this.dialog.open(LookupComponent, dialogConfig);
      } else {
        const randomParam = new Date().getTime();
        const res = await lastValueFrom(this.http.get<LookupData>(`assets/control-lookup/${this.control}.json?r=${randomParam}`).pipe(
          catchError((error: any) => {
            return of(false);
          }),
          map((res) => {
            return res;
          })));
        if (typeof res == 'object') {
          res.filter = res.filter.map((item) => {
            if ((item.value as string).includes('@@')) {
              const name = (item.value as string).replace('@@', '');
              if (this.authenticate.userValue) {
                const value = this.authenticate.userValue[name];
                return { ...item, value: value };
              }
              return { ...item, operator: 'like', value: '%%' };
            }
            else if ((item.value as string).includes('@')) {
              const name = (item.value as string).replace('@', '');
              const value = this.filterOther[name];
              if (value) {
                return { ...item, value: value };
              }
              return { ...item, operator: 'like', value: '%%' };
            }
            return item;
          });
          res.filter = [...res.filter, ...this.filter];
          if (this.value !== undefined) {
            var currentValue = this.value.split(',').map((item: any) => item.trim());
          }
          dialogConfig.data = { ...res, currentValue: currentValue, isChoose: this.isChoose, code: this.name };
        }
        dialogRef = this.dialog.open(LookupV2Component, dialogConfig);
      }
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const list_control: { control: any; value: any; }[] | undefined = [];
          this.reference.forEach((item: any) => {
            if (typeof item == 'object') {
              item.value = result[item.name] || (typeof (result[item.name]) == 'boolean' ? false : '');
              // this.handleChangeLookup.emit({});
              list_control.push({ control: item.name, value: item.value });
            }
            else {
              if (this.mapper) {
                list_control.push({ control: this.mapper[item], value: result[item] || (typeof (result[item.name]) == 'boolean' ? false : '') });
              }
              else {
                if (result.length > 0) {
                  result[item] = result.map((item: any) => item[this.name]).join(', ');
                }
                list_control.push({ control: item, value: result[item] || (typeof (result[item.name]) == 'boolean' ? false : '') });
              }
            }
          });

          this.handleChange.emit(this.value);
          this.handleChangeLookup.emit(list_control);

          const popup_res: any = { is_popup_filter: true, result: result };
          this.handleChangeResponse.emit(popup_res);
        }
      });
    }
    else {
      console.error(`control của ${this.name} không được để trống`);
    }
  }
  onClickButton($event: any, id: string) {
    $event.preventDefault();
    const buttonActive = this.buttons.find(x => x.id == id);
    if (buttonActive) {
      const temp = buttonActive.activeColor;
      buttonActive.activeColor = buttonActive.iconColor;
      buttonActive.iconColor = temp;
    }
    this.handleButton.emit(id);
    // this.resetColumnWidth();
  }
  onScanner() {
    this.scanQRCode().subscribe((item) => {
      this.handleScanner.emit(item);
    });
  }
  onClickUploadImage() {
    this.handleUploadImage.emit();
  }

  onClickUViewPhoto() {
    this.handleUViewPhoto.emit();
  }
  onClickAction() {
    this.handleAction.emit();
  }
  scanQRCode(): Observable<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '100';
    // dialogConfig.height = '400px';
    // dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(ScanQrcodeComponent, dialogConfig);
    return dialogRef.afterClosed();
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
    // if (this.type === 'number' && isFloat($event) && $event) {
    //   this.input.nativeElement.value = this.formatValue(Number.parseInt($event));
    //   this.handleChange.emit(this.previousValue);
    // }
    // if (this.type === 'number' && !isFloat($event) && $event) {
    //   this.input.nativeElement.value = this.previousValue;
    //   this.value = this.previousValue;
    //   this.handleChange.emit(this.previousValue);
    // }
    // else
    let value = this.value;
    if (this.type === 'number') {
      value = this.value.toString().replace(/\D/g, '') || '0';
      value = parseInt(value);
      this.input.nativeElement.value = this.formatValue(value);
    }
    this.handleChange.emit(value);
  }

  formatValue(value: any) {
    const dataFormatPipe = new DataFormatPipe();
    const format = (dataFormat as any)[this.dataFormatString];

    if (format && value) {
      return dataFormatPipe.transform(value, this.type, format);
    } else if (this.type === 'number') {
      return value + ''.toString().replace(/\D/g, '') || '0';
    }
    else {
      return value;
    }
  }
  public castIcon(value: string): IconName {
    return value as IconName;
  }
  onDateChange(event: any) {
    this.handleChange.emit(event.target.value);
  }

  //#region search
  async onQuickSearch(value: string) {
    if (typeof this.control == 'object') {
      const filter: ItemFilter[] = [];
      this.reference.forEach((item: any) => {
        if (typeof item == 'object') {
          filter.push({ name: item.name, operator: 'like', value: '%' + value + '%', isRequired: false });
        }
        else {
          if (this.mapper) {
            filter.push({ name: this.mapper[item], operator: 'like', value: '%' + value + '%', isRequired: false });
          }
          else {
            filter.push({ name: item, operator: 'like', value: '%' + value + '%', isRequired: false });
          }
        }
      });
      return this.control.getItems({ pageIndex: this.pageIndex, pageSize: this.pageSize }, filter, { name: '', direction: '' });
      //
    } else {
      const randomParam = new Date().getTime();
      const res = await lastValueFrom(this.http.get<LookupData>(`assets/control-lookup/${this.control}.json?r=${randomParam}`).pipe(
        catchError((error: any) => {
          return of(false);
        }),
        map((res) => {
          return res;
        })));
      if (typeof res == 'object') {
        const filter = res.filter.map((item) => {
          if ((item.value as string).includes('@@')) {
            const name = (item.value as string).replace('@@', '');
            if (this.authenticate.userValue) {
              const value = this.authenticate.userValue[name];
              return { ...item, value: value };
            }
            return { ...item, operator: 'like', value: '%%' };
          }
          else if ((item.value as string).includes('@')) {
            const name = (item.value as string).replace('@', '');
            const value = this.filterOther[name];
            if (value) {
              return { ...item, value: value };
            }
            return { ...item, operator: 'like', value: '%%' };
          }
          return item;
        });
        this.categoryService.initData(res.entity, res.title, res.entity);
        this.reference.forEach((item: any) => {
          if (typeof item == 'object') {
            filter.push({ name: item.name, operator: 'like', value: value, isRequired: false });
          }
          else {
            if (this.mapper) {
              filter.push({ name: item, operator: 'like', value: value, isRequired: false });
            }
            else {
              filter.push({ name: item, operator: 'like', value: value, isRequired: false });
            }
          }
        });
        return this.categoryService.getItems({ pageIndex: this.pageIndex, pageSize: this.pageSize }, filter, { name: '', direction: '' });
      }
      return this.categoryService.getItems({ pageIndex: this.pageIndex, pageSize: this.pageSize }, [], { name: '', direction: '' });
    }
  }
  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
  onClickChangePage(event: any) {
    if (event == 'prev') {
      if (this.pageIndex == 0) return;
      this.pageIndex--;
    }
    else {
      if (this.pageIndex == this.pageCount - 1) return;
      this.pageIndex++;
    }

  }

  search(packageName: string) {
    if (this.lookup && packageName && packageName.length > 2) {
      this.withRefresh = false;
      this.searchText$.next(packageName);
    }
  }

  getName() {
    let name = this.name;
    if (this.mapper) {
      for (const [key, value] of Object.entries(this.mapper)) {
        if (value == this.name) {
          name = key;
        }
      }
    }
    return name;
  }
  getDesctioption(object: any) {
    let res = '';
    this.reference.forEach((item: any) => {
      if (typeof item == 'object') {
        if (item.name != this.name) {
          res += object[item.name] + ' ';
        }
      }
      else {
        if (this.mapper) {
          if (item != this.getName()) {
            res += object[item] + ' ';
          }
        }
        else {
          if (item != this.name) {
            res += object[item] + ' ';
          }
        }
      }
    });
    return res;
  }
  onClickSearchItem(object: any) {
    this.searchResult = [];
    const list_control: { control: any; value: any; }[] | undefined = [];
    this.reference.forEach((item: any) => {
      if (typeof item == 'object') {
        item.value = object[item.name] || (typeof (object[item.name]) == 'boolean' ? false : '');
        // this.handleChangeLookup.emit({});
        list_control.push({ control: item.name, value: item.value });
      }
      else {
        if (this.mapper) {
          list_control.push({ control: this.mapper[item], value: object[item] || (typeof (object[item.name]) == 'boolean' ? false : '') });
        }
        else {
          list_control.push({ control: item, value: object[item] || (typeof (object[item.name]) == 'boolean' ? false : '') });
        }
      }
    });
    this.handleChange.emit(this.value);
    this.handleChangeLookup.emit(list_control);

  }
  //#endregion
}