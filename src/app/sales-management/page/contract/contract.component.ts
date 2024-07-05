import { Component, ViewChild, ElementRef, Renderer2, Input, AfterViewInit, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import dataFormat from '@app/_common/dataFormat';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { ContractTicketCreate } from '@app/sales-management/model/ticket/contract/model';
import { ContractService } from './contract.service';
import { ActivatedRoute } from '@angular/router';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { CommonService } from '../common/common.service';
import { MODE } from '@app/sales-management/enum/ticket.enum';
import { Language } from '../common/language';

const { MERCHANDISE_CONTRACT } = require('@assets/fields/grid/sales-fields-table.json')
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements AfterViewInit, OnInit, OnChanges {
  contract: ContractTicketCreate = new ContractTicketCreate;
  statusList: StatusTicket[] = [];
  dataFormat = dataFormat;
  merchandiseColumns = MERCHANDISE_CONTRACT;
  entity = TICKET_ENTITY.CONTRACT;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  title = '';
  disableSelectStatus = false;
  readonly = false;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService
  ) {
    localStorage.setItem('useGridCached', '1');
    this.contractService.setTicket(this.contract);
  }



  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.route.url.subscribe(urlSegment => {
      const path = urlSegment[0].path;
      if (urlSegment[0].path) {
        switch (path) {
          case 'create':
            this.title = Language.content.add_new;
            this.disableSelectStatus = true;
            this.mode = MODE.CREATE;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
            break;
          case 'update':
            this.title = Language.content.edit;
            this.mode = MODE.UPDATE;
            this.disableSelectStatus = false;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
            break;
          case 'view':
            this.title = Language.content.view;
            this.mode = MODE.VIEW;
            this.readonly = true;
            this.cancelButtonTitle = Language.content.exit;
            break;
        }
      }
    });
    const getStatusList = () => {
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.CONTRACT }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };
    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.CONTRACT, data.key).subscribe((result) => {
          if (result.result) {
            console.log(result.result);
            this.contractService.loadData(result.result as any as VoucherDto);
            getStatusList();
          }
        });
      } else {
        // this.contractService.initTicket(this.ticket);
      }

    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }


  onInputCustomer(ma_kh: string) { }
  openCustomerDialog() { }
  onRemoveMerchandise() { }


  onSave() { }
  onCancel() { }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }
}
