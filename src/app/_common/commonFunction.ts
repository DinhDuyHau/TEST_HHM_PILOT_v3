import { formatDate } from '@angular/common';
import dataFormat from './dataFormat';
import { Resource } from '@app/_models';
import { Observable, of } from 'rxjs';
import { MenuItem } from '@app/_components/_shared/sidebar/header.model';
import { Route, Router } from '@angular/router';
import { CategoryComponent } from '@app/_components/category/category.component';
import { AppLayoutComponent } from '@app/app-layout.component';
import { AuthGuard } from '@app/_helpers';
import { ReportComponent } from '@app/_components/report/report.component';

/**
 * Kiểm tra chuỗi imei nhập vào có hợp lệ hay không
 * @param imei mã imei cần kiểm tra
 */
export function checkValidImei(imei: string): boolean {
    const regex = /[^A-Za-z0-9.+\-*\/_?%$&]/;
    return !regex.test(imei);
}

/**
 * convert chuỗi tiếng việt có dấu thành không dấu
 * @param text chuỗi input cần convert
 * @returns
 */
export function convertToSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[áàãạảăắằẵẳâấầẫẩạ]/g, 'a')
        .replace(/[éèẽẹẻêếềễểệ]/g, 'e')
        .replace(/[íìĩịỉ]/g, 'i')
        .replace(/[óòõọỏôốồỗổộơớờỡởợ]/g, 'o')
        .replace(/[úùũụủưứừữửự]/g, 'u')
        .replace(/[ýỳỹỵỷ]/g, 'y')
        .replace(/[^a-zA-Z0-9]/g, '_');
}

export function generateStringDatetime(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return formattedDate;
}
export function generateStringDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}
export function getDateFormat(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
export function getDateTimeFormat(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

export function getMenuReport(sysid: string) {
    const menu = JSON.parse(localStorage.getItem('menu_report') || '');
    return menu[sysid];
}

export function formatData(value: any, type: string, dataFormatString: string) {
    let temp = value;
    if (type === 'number') {
        temp = temp.replaceAll(' ', '');
        temp = temp.replaceAll('.', '');
        temp = temp.replaceAll(',', '.');
        temp = Number(temp);
        if (Number.isNaN(temp)) return value;
        let formattedNumber;
        switch (dataFormatString) {
            case (dataFormat.exchangeRateInputFormat,
                dataFormat.baseCurrencyPriceViewFormat,
                dataFormat.foreignCurrencyPriceInputFormat):
                formattedNumber = temp
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$& ');
                break;
            case (dataFormat.exchangeRateViewFormat,
                dataFormat.baseCurrencyPriceViewFormat,
                dataFormat.foreignCurrencyPriceViewFormat):
                formattedNumber = temp
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$& ');
                formattedNumber = formattedNumber.slice(0, -3);
                break;
            case dataFormat.quantityInputFormat:
                formattedNumber = temp
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$& ');
                // formattedNumber = formattedNumber.replace('.', ' ');
                break;
            case dataFormat.quantityViewFormat:
                formattedNumber = temp
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$& ');
                formattedNumber = formattedNumber.slice(0, -3);
                // formattedNumber = formattedNumber.replace('.', ' ');
                break;
            case dataFormat.baseCurrencyAmountInputFormat:
                formattedNumber = temp.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$& ');
                break;
            case dataFormat.baseCurrencyAmountViewFormat:
                formattedNumber = temp.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$& ');
                // formattedNumber = formattedNumber.replace('.', ' ');
                break;
            case dataFormat.analysisInputFormat:
                formattedNumber = temp
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$& ');
                formattedNumber = formattedNumber.replace('.', ' ');
                formattedNumber = formattedNumber.replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    '$1 ',
                );
                break;
            case dataFormat.analysisViewFormat:
                formattedNumber = temp
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$& ');
                formattedNumber = formattedNumber.slice(0, -3);
                formattedNumber = formattedNumber.replace('.', ' ');
                formattedNumber = formattedNumber.replace(
                    /(\d)(?=(\d{3})+(?!\d))/g,
                    '$1 ',
                );
                break;
            default:
                formattedNumber = temp.toString();
                break;
        }
        return formattedNumber;
    } else if (type === 'string' || type === 'text' || type === '') {
        if (dataFormatString === dataFormat.lowercaseFormat) {
            return temp.toLowerCase();
        } else if (dataFormatString === dataFormat.upperCaseFormat) {
            return temp.toUpperCase();
        }
    } else if (type === 'date') {
        if (dataFormatString === dataFormat.datetimeFormat) {
            return formatDate(temp, dataFormatString, 'en_US');
        }
    }
    return temp;
}

export function checkFormat(value: string, separate: string, numberAfterSeparate: number): boolean {
    const regexPattern = `^\\d{1,3}(\\${separate}\\d{3})*(\\${separate}\\d{1,${numberAfterSeparate}})?$`;
    const regex = new RegExp(regexPattern);
    return regex.test(value);
}

export function checkFormatInteger(value: string) {
    const regexPattern = /^-?\d+$/;
    return regexPattern.test(value);
}

export function isEmail(text: string) {
    const reg = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
        return false;
    } else {
        return true;
    }
}

export function isPassword(text: string) {
    const reg =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (reg.test(text) === false) {
        return false;
    } else {
        return true;
    }
}
export function isPhone(text: string) {
    const reg = /^\d{10}$|^\+\d{11}$/;
    if (reg.test(text) === false) {
        return false;
    } else {
        return true;
    }
}

export function isDecimal(text: string) {
    const reg = /[0-2]/;
    if (reg.test(text) === false) {
        return false;
    } else {
        return true;
    }
}
export function isFloat(text: string) {
    const reg = /^(?=.{1,15}$)([1-9]\d{0,11}|0)(\.\d{0,1})?$/;
    if (reg.test(text) === false) {
        return false;
    } else {
        return true;
    }
}
export function checkNumber(text: string, integer_part = 16, decimal_part = 2) {
    const reg = `^(?=.{1,${integer_part + decimal_part + 1
        }}$)([1-9]\\d{0,${integer_part}}|0)(\\.\\d{0,${decimal_part}})?$`;
    const dynamicRegex = new RegExp(reg);
    if (dynamicRegex.test(text) === false) {
        return false;
    } else {
        return true;
    }
}
export function isInteger(text: string) {
    const reg = /^[1-9]\d{0,11}$/;
    if (reg.test(text) === false) {
        return false;
    } else {
        return true;
    }
}

export function slugify(text: string) {
    return text
        .replace(/[^-a-zA-Z0-9\s+]+/gi, '')
        .replace(/\s+/gi, '-')
        .toLowerCase();
}

export function formatMoney(amount: any) {
    let decimalCount = 2;
    const decimal = '.';
    const thousands = ',';

    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? '-' : '';

        const i = parseInt(
            (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
        ).toString();
        const j = i.length > 3 ? i.length % 3 : 0;

        return (
            negativeSign +
            (j ? i.substr(0, j) + thousands : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
            (decimalCount
                ? decimal +
                Math.abs(amount - Number.parseInt(i))
                    .toFixed(decimalCount)
                    .slice(2)
                : '')
        );
    } catch (e) {
        console.log(e);
        return amount;
    }
}
export function byteArrayToBase64(byteArray: number[]): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(String.fromCharCode(...byteArray));
    const base64String = btoa(String.fromCharCode(...data));
    return base64String;
}

export function getResource(name: string, language = 'vi_VN'): string {
    const resources: Resource[] = JSON.parse(localStorage.getItem('resources') || '');
    const resource = resources.find(x => x.name == name);
    if (resource) {
        if (language == 'vi_VN')
            return resource.message || '';
        else return resource.message2 || '';
    }
    return '';
}

export function getMenuFromLocalStorage2(): Observable<any> {
    const menu = parseMenu(JSON.parse(localStorage.getItem('menu')!));
    return of(menu);
}
export function parseMenu(data: MenuItem[]): any {
    const map = new Map<string, MenuItem>();
    const roots: MenuItem[] = [];
    if (data) {
        // Create a map of all menu items
        data.forEach(item => {
            item.children = [];
            map.set(item.wmenu_id, item);
        });

        // Build the tree
        data.forEach(item => {
            const parent = map.get(item.wmenu_id0);
            if (parent) {
                parent.children.push(item);
            } else {
                item = { ...item, extend: false };
                roots.push(item);
            }
        });
    }

    return roots;
}
export function getRouteCategoryNotExists(router: Route[]) {
    const route: Route[] = [];
    let link = '';
    getMenuFromLocalStorage2().subscribe((menuItem: MenuItem[]) => {
        const category_menus = menuItem.filter(x => x.type === 'D' || x.type === 'd');
        if (category_menus && category_menus.length > 0)
            for (let cate_menu_item of category_menus) {
                cate_menu_item.children.forEach(element => {
                    link = element.link.charAt(0) == '/' ? element.link.slice(1) : element.link;
                    if (!checkIfRouteExists(router, link)) {
                        route.push({
                            path: link, component: AppLayoutComponent, canActivate: [AuthGuard],
                            children: [
                                { path: '', component: CategoryComponent, canActivate: [AuthGuard] }
                            ]
                        });
                    }
                });
            }
    });
    return route;
}
export function getRouteReportNotExists(router: Route[]) {
    const route: Route[] = [];
    let link = '';
    getMenuFromLocalStorage2().subscribe((menuItem: MenuItem[]) => {
        const report_menus = menuItem.filter(x => x.type === 'R' || x.type === 'r');
        if (report_menus && report_menus.length > 0)
            for (let rpt_menu_item of report_menus) {
                rpt_menu_item.children.forEach(element => {
                    link = element.link.charAt(0) == '/' ? element.link.slice(1) : element.link;
                    if (!checkIfRouteExists(router, link)) {
                        route.push({
                            path: link, component: AppLayoutComponent, canActivate: [AuthGuard],
                            children: [
                                { path: '', component: ReportComponent, canActivate: [AuthGuard] }
                            ]
                        });
                    }
                });
            }
    });
    return route;
}


export function checkIfRouteExists(router: Route[], routePath: string): boolean {
    const routeExists = router.some(route => route.path === routePath);
    return routeExists;
}

export function getFirstDayOfMonth(date: Date) {
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const year = firstDate.getFullYear();
    const month = (firstDate.getMonth() + 1).toString().padStart(2, '0');
    const day = firstDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
export function getLastDayOfMonth(date: Date) {
    const firstDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const year = firstDate.getFullYear();
    const month = (firstDate.getMonth() + 1).toString().padStart(2, '0');
    const day = firstDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
export function getDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
