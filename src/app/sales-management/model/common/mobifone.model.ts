export class Mobifone {
  transCode: string = '';
  partnerType: number = 0;
  transDate: string = '';
  vat: number = 0;
  custName: string = '';
  address: string = '';
  telNumber: string = '';
  tin: string = '';
  shopCode: string = '';
  lstItem: Item[] = [];

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}

export class Item {
  goodCode: string = '';
  goodName: string = '';
  amount: number = 0;
  discount: number = 0;
  imei: string = '';
  attachStatus: string = '';
  entryPrice: number = 0;
}