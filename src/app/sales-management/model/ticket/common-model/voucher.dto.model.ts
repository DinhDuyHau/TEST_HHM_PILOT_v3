
export class VoucherDto {
    masterInfo: any;
    details: DetailDto[] = []

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}

export interface DetailDto {
    id: number,
    name: string,
    data: any
}