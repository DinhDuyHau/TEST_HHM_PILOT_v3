import { IGridService, IGridServiceV2, ItemFilter } from '../gridV2/grid.model';

export interface LookupData {
    arraySelected: any;
    title: string;
    entity: string;
    filter: ItemFilter[];
    multipleChoose: boolean;
    isChoose: boolean;
    code: string;
    entityLookupField: string;
}