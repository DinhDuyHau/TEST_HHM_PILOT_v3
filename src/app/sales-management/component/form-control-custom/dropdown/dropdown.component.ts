import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'dropdown-custom',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownCustomComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() name!: string;
  @Input() label!: string;
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;
  @Output() handleChangeValue = new EventEmitter<boolean>();

  dropdown: boolean = false;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selected) {
      this.dropdown = this.selected;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  handleDropdown() {
    if (!this.disabled) {
      this.dropdown = !this.dropdown;
      this.selected = this.dropdown;
      this.handleChangeValue.emit(this.selected);
    }
  }
}


