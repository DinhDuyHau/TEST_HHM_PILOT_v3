import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { RefundBaokimService } from './refund-baokim.service';
import { Refund } from './refund-baokim.model';

@Component({
  selector: 'app-refund-baokim',
  templateUrl: './refund-baokim.component.html',
  styleUrls: ['./refund-baokim.component.scss']
})
export class RefundBaokimComponent extends Grid<Refund> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private RefundBaokimService: RefundBaokimService) {
    super(RefundBaokimService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}
