import { BaseEntity } from "./base-entity.model";

export class Guarantee {
    ma_vt: string = '';
    ma_ttbh: string = '';
    ten_ttbh: string = '';
    ma_imei: string = '';
    hang_sx: string = '';
    dia_chi: string = '';
    line_nbr: number = 0;
}

export class GuaranteeRequest extends BaseEntity {
    ma_vt: string = '';
    ma_ttbh: string = '';
    ten_ttbh: string = '';
    ma_imei: string = '';
    hang_sx: string = '';
    dia_chi: string = '';
    line_nbr: number = 0;

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}