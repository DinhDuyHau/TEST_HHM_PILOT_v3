import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { DepositBaokimService } from './deposit-baokim.service';
import { Deposit } from './deposit-baokim.model';

@Component({
  selector: 'app-deposit-baokim',
  templateUrl: './deposit-baokim.component.html',
  styleUrls: ['./deposit-baokim.component.scss']
})
export class DepositBaokimComponent extends Grid<Deposit> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private DepositBaokimService: DepositBaokimService) {
    super(DepositBaokimService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}
