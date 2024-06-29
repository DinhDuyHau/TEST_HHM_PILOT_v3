import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface IStore {
  value: string,
  label: string
}

@Component({
  selector: 'select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSearchComponent),
      multi: true
    }
  ]
})
export class SelectSearchComponent implements ControlValueAccessor, OnChanges, OnInit {
  stores: IStore[] = [];
  filteredStores: IStore[] = [];
  selectedStore: IStore | null = null;
  searchText: string = '';
  dropdownOpen: boolean = false;
  public value: string = '';

  @Input() data: any = []

  public isDisabled: boolean = false;

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() { }

  writeValue(value: any): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  ngOnInit(): void {
    this.stores = this.data;
    this.filteredStores = this.stores;
    this.selectedStore = this.data[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes as any).data) {
      this.stores = this.data;
      this.filteredStores = this.stores;
    }
  }

  filterItems(): void {
    // console.log('filter', this.data)
    this.filteredStores = this.stores.filter((store: any) =>
      store.label.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectStore(store: IStore): void {
    this.onChange(store.value)
    this.selectedStore = store
    this.dropdownOpen = false;
  }

  onInputChange($event: any) {
    this.onChange($event.target.value)
  }
}
