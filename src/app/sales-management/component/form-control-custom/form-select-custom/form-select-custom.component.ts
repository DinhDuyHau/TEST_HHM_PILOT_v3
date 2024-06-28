import { Component, Input, OnInit, OnChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'form-select-custom',
  templateUrl: './form-select-custom.component.html',
  styleUrls: ['./form-select-custom.component.scss']
})
export class FormSelectCustomComponent implements OnInit, OnChanges, AfterViewInit {
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

  onChangeValue(event: any) {
    this.handleChangeValue.emit(event.target.value);
  }

  onChangeSearch(event: any) {
    this.handleSearchOption.emit();
  }

  handleDropdown() {
    this.dropdown = !this.dropdown;
  }
}
