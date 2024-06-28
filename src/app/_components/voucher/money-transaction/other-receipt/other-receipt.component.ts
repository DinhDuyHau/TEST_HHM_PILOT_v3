import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { OtherReceiptService } from './other-receipt.service';
import { Receipt } from './other-receipt.model';

@Component({
  selector: 'app-other-receipt',
  templateUrl: './other-receipt.component.html',
  styleUrls: ['./other-receipt.component.scss']
})
export class OtherReceiptComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private OtherReceiptService: OtherReceiptService) {
    super(OtherReceiptService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}