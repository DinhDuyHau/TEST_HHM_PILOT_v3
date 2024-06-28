import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { RecommentToUseService } from './recomment-to-use.service';
import { Receipt } from './recomment-to-use.model';

@Component({
  selector: 'app-recomment-to-use',
  templateUrl: './recomment-to-use.component.html',
  styleUrls: ['./recomment-to-use.component.scss']
})
export class RecommentToUseComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private returnSupplierService: RecommentToUseService) {
    super(returnSupplierService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}