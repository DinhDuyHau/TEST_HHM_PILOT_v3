import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'tab-custom',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabCustomComponent implements OnInit {
  @Output() handleTabChange = new EventEmitter<string>();

  @Input() label!: string;
  @Input() activatedTab!: string;

  constructor() {
  }

  ngOnInit(): void {

  }

  SetTab() {
    if (this.label) {
      this.handleTabChange.emit(this.label);
    }
  }

}


