import { Component, OnChanges, OnInit } from '@angular/core';
import { Model } from './voucher.model';
import { Button, Field, Grid, IGridServiceV2 } from '../../gridV2/grid.model';
import { VoucherService } from './voucher.service';
import { TypeVoucher, VOUCHER_TYPE } from '../enum/voucher_enum';
import button from '@app/_common/button';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent extends Grid<Model> implements OnInit, OnChanges {
  voucherCode = VOUCHER_TYPE.EVENT_GIFT.voucherCode;
  sysid = VOUCHER_TYPE.EVENT_GIFT.sysid;
  buttonsCustom: Button[] = [];
  voucherService!: VoucherService;

  constructor(private http: HttpClient, private dialog: MatDialog, private authenticateService: AuthenticationService, private snack: MatSnackBar, private route: ActivatedRoute, private commonService: CommonService) {
    localStorage.removeItem('useGridCached');

    const voucherService = new VoucherService(http, dialog, authenticateService, snack, route, commonService);
    super(voucherService);
    this.voucherService = voucherService;
    this.route.data.subscribe((result: any) => {
      const type: TypeVoucher = result;
      this.voucherCode = type.voucherCode;
      this.sysid = type.sysid;
      this.buttonsCustom = type.button;
    });
    document.title = voucherService.getTitle();
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }

  onHandleActionButton(event: { buttonId: string; data?: any; index: number }) {
    switch (event.buttonId) {
      case button.DeleteButton.id:
        this.voucherService.delete(event.data).subscribe(res => {
          if (res) {
            this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
          }
        });
        break;
      default:
        break;
    }
  }

}