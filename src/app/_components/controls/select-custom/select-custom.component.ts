import { Component, Input, OnInit, OnChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'select-custom',
  templateUrl: './select-custom.component.html',
  styleUrls: ['./select-custom.component.scss']
})
export class SelectCustomComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() isDisable = false;
  @Input() label!: string;
  @Input() options!: any;
  @Input() des!: string;
  @Input() value!: any;
  @Input() optionValue!: string;
  @Input() optionDes!: string;

  @Output() handleSearchOption = new EventEmitter<any>();
  @Output() handleChangeValue = new EventEmitter<any>();

  dropdown = false;

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: any) {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  onChangeValue($event: any) {
    this.value = $event?.target.value;
    this.handleChangeValue.emit(this.value);
  }

  onChangeSearch() {
    console.log('onChangeSearch onChangeSearch');
    this.handleSearchOption.emit();
  }

  handleDropdown() {
    this.dropdown = !this.dropdown;
  }
}
