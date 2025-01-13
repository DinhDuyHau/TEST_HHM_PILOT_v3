import { IGridService, IGridServiceV2 } from '../gridV2/grid.model';

export interface LookupData {
    title: string;
    service: IGridServiceV2<any>;
    multipleChoose: boolean;
    highlightColumns?: string[];
}
