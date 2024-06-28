import { Component, Input, OnInit, OnChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'form-search-select-custom',
  templateUrl: './form-search-select-custom.component.html',
  styleUrls: ['./form-search-select-custom.component.scss']
})
export class FormSearchSelectCustomComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() isDisable: boolean = false;
  @Input() label!: string;
  @Input() options!: any;
  @Input() des!: string;
  @Input() value!: any;
  @Input() optionValue!: string;
  @Input() optionDes!: string;

  @Output() handleSearchOption = new EventEmitter<any>();
  @Output() handleChangeValue = new EventEmitter<any>();

  dropdown: boolean = false;

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
  }

  ngAfterViewInit(): void {
  }

  onChangeValue(value: any) {
    this.handleChangeValue.emit(value);
  }

  onChangeSearch() {
    console.log("onChangeSearch onChangeSearch");
    this.handleSearchOption.emit();
  }

  handleDropdown() {
    this.dropdown = !this.dropdown;
  }
}
