export class Filter {
    width?: number;
    height?: number;
    control?: Control[][];
}
export class Control {
    align?: string = '';
    name = '';
    type?: string = '';
    value?: string = '';
    label = '';
    codeScanner?: boolean = false;
    isLookup?: boolean = false;
    control?: string = '';
    mapper?: any;
    action?: boolean = false;
    titleButton?: string = '';
    uploading?: boolean = false;
    isEye?: boolean = false;
    uploadImage?: boolean = false;
    disabled?: boolean = false;
    required?: boolean = false;
    hidden = false;
    tabIndex?: number = 0;
    dataFormatString?: string = '';
    reference?: string[] = [];
    class?: string = '';
    isExternalField?: boolean = false;
    options?: any[] = [];
    des!: string;
    optionValue?: any;
    optionDes!: string;
}
