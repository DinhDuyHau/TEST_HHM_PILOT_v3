import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FuncExtendService {
    /*************************************************
     **     DEEP CLONE FOR OBJECT AND ARRAY        ***
     *************************************************/
    getType(obj: any) {
        const str: string = Object.prototype.toString.call(obj);
        const map: any = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regExp',
            '[object Undefined]': 'undefined',
            '[object Null]': 'null',
            '[object Object]': 'object'
        };
        if (obj instanceof Element) {
            return 'element';
        }
        return map[str];
    }

    //for array
    private copyArray(ori: any, type: any, copy: any[] = []) {
        for (const [index, value] of ori.entries()) {
            copy[index] = this.deepCopy(value);
        }
        return copy;
    }

    //for object
    private copyObject(ori: any, type: any, copy: any = {}) {
        for (const [key, value] of Object.entries(ori)) {
            copy[key] = this.deepCopy(value);
        }
        return copy;
    }

    //for function
    private copyFunction(ori: any, type: any, copy = () => { }) {
        const fun = eval(ori.toString());
        fun.prototype = ori.prototype
        return fun
    }

    deepCopy(ori: any) {
        const type = this.getType(ori);
        let copy;
        switch (type) {
            case 'array':
                return this.copyArray(ori, type, copy);
            case 'object':
                return this.copyObject(ori, type, copy);
            case 'function':
                return this.copyFunction(ori, type, copy);
            default:
                return ori;
        }
    }
    /*******************************************************/

}