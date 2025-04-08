import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { WithDrawBaokimService } from './withdraw-baokim.service';
import { WithDraw } from './withdraw-baokim.model';

@Component({
  selector: 'app-withdraw-baokim',
  templateUrl: './withdraw-baokim.component.html',
  styleUrls: ['./withdraw-baokim.component.scss']
})
export class WithdrawBaokimComponent extends Grid<WithDraw> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private WithDrawBaokimService: WithDrawBaokimService) {
    super(WithDrawBaokimService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}
