import { IGridService, IGridServiceV2, ItemFilter } from '../gridV2/grid.model';

export interface LookupData {
    currentValue: any;
    title: string;
    entity: string;
    filter: ItemFilter[];
    multipleChoose: boolean;
    code: string;
}