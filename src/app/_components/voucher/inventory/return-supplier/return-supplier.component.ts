import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { ReturnSupplierService } from './return-supplier.service';
import { Receipt } from './return-supplier.model';

@Component({
  selector: 'app-return-supplier',
  templateUrl: './return-supplier.component.html',
  styleUrls: ['./return-supplier.component.scss']
})
export class ReturnSupplierComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private returnSupplierService: ReturnSupplierService) {
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