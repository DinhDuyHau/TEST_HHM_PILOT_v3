import { formatNumber } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import dataFormat from '@app/_common/dataFormat';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'formatData',
})
export class DataFormatPipe implements PipeTransform {
  transform(
    value: any,
    type?: string,
    dataFormatString?: string,
    ...args: unknown[]
  ): unknown {
    if (value === undefined) return '';
    if (type === 'number') {
      let formattedNumber;
      switch (dataFormatString) {
        case (dataFormat.exchangeRateInputFormat,
          dataFormat.baseCurrencyPriceViewFormat,
          dataFormat.foreignCurrencyPriceInputFormat):
          formattedNumber = value
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          break;
        case (dataFormat.exchangeRateViewFormat,
          dataFormat.baseCurrencyPriceViewFormat,
          dataFormat.foreignCurrencyPriceViewFormat):
          formattedNumber = value
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          formattedNumber = formattedNumber.slice(0, -3);
          break;
        case dataFormat.quantityInputFormat:
          // console.log('first' + value);
          value = Number.parseFloat(value);
          // console.log(value);
          // console.log(value.toFixed(2));

          formattedNumber = value
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          // formattedNumber = formattedNumber.replace('.', ' ');
          break;
        case dataFormat.quantityViewFormat:
          formattedNumber = value
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          formattedNumber = formattedNumber.slice(0, -3);
          // formattedNumber = formattedNumber.replace('.', ' ');
          break;
        case dataFormat.baseCurrencyAmountInputFormat:
          formattedNumber = value.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$& ');
          break;
        case dataFormat.baseCurrencyAmountViewFormat:
          formattedNumber = value.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$& ');
          // formattedNumber = formattedNumber.replace('.', ' ');
          break;
        case dataFormat.analysisInputFormat:
          formattedNumber = value
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          formattedNumber = formattedNumber.replace('.', ' ');
          formattedNumber = formattedNumber.replace(
            /(\d)(?=(\d{3})+(?!\d))/g,
            '$1 ',
          );
          break;
        case dataFormat.analysisViewFormat:
          formattedNumber = value
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          formattedNumber = formattedNumber.slice(0, -3);
          formattedNumber = formattedNumber.replace('.', ' ');
          formattedNumber = formattedNumber.replace(
            /(\d)(?=(\d{3})+(?!\d))/g,
            '$1 ',
          );
          break;
        case dataFormat.moneyViewFormat:
          // formattedNumber = value < 0 ?
          //   '-' + value.toString().replace(/\D/g, '').replace(/\d(?=(\d{3})+(?!\d))/g, '$&,') || '0'
          //   : value.toString().replace(/\D/g, '').replace(/\d(?=(\d{3})+(?!\d))/g, '$&,') || '0';
          if (!value || value == '') return '';
          formattedNumber = value.toLocaleString('en-US', { maximumFractionDigits: 2 });
          break;
        case dataFormat.moneyViewFormat2:
          formattedNumber = value < 0 ?
            '-' + value.toString().replace(/\D/g, '').replace(/\d(?=(\d{3})+(?!\d))/g, '$&,') || ''
            : value.toString().replace(/\D/g, '').replace(/\d(?=(\d{3})+(?!\d))/g, '$&,') || '';
          break;
        case dataFormat.moneyViewFormat3:
          formattedNumber = value.toString().includes('-') ?
            '-' + value.toString().replace(/[^0-9]/g, '').replace(/\d(?=(\d{3})+(?!\d))/g, '$&,') || ''
            : value.toString().replace(/[^0-9]/g, '').replace(/\d(?=(\d{3})+(?!\d))/g, '$&,') || '';
          break;
        case dataFormat.moneyInputFormat:
          formattedNumber = value < 0 ?
            '-' + value.toString().replace(/\D/g, '').replace(/\d(?=(\d{3})+(?!\d))/g, '$&,') || '0'
            : value.toString().replace(/\D/g, '').replace(/\d(?=(\d{3})+(?!\d))/g, '$&,') || '0';
          break;
        case dataFormat.moneyViewNoDigit:
          if (value === undefined || value === null || value === '') return '';
          formattedNumber = value.toLocaleString('en-US', { maximumFractionDigits: 0 });
          break;
        case dataFormat.moneyView2Digit:
          if (value === undefined || value === null || value === '') return '';
          formattedNumber = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          break;
        case dataFormat.moneyViewThousandRound:
          if (value === undefined || value === null || value === '') return '';
          formattedNumber = value.toLocaleString('en-US', { maximumFractionDigits: -3 });
          break;
        case dataFormat.normalQuantity:
          try {
            value = Number.parseFloat(value);
          }
          catch {
            console.error(`Cannot parse string to number value : ${value} format: ${dataFormat}`);
          }
          formattedNumber = value.toLocaleString('en-US', { maximumFractionDigits: 2 });
          break;
        case dataFormat.normalPrice:
          try {
            if (value === '') {
              value = '';
            }
            else {
              value = Number.parseFloat(value);
            }
          }
          catch {
            console.error(`Cannot parse string to number value : ${value} format: ${dataFormat}`);
          }
          formattedNumber = value.toLocaleString('en-US', { maximumFractionDigits: 0 });
          break;
        case dataFormat.normalQuantityVN:
          try {
            value = Number.parseFloat(value);
          }
          catch {
            console.error(`Cannot parse string to number value : ${value} format: ${dataFormat}`);
          }
          formattedNumber = value.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
          break;
        case dataFormat.normalPriceVN:
          try {
            value = Number.parseFloat(value);
          }
          catch {
            console.error(`Cannot parse string to number value : ${value} format: ${dataFormat}`);
          }
          formattedNumber = value.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
          break;
        case dataFormat.countingFormat:
          try {
            value = Number.parseFloat(value || '0');
          }
          catch {
            console.error(`Cannot parse string to number value : ${value} format: ${dataFormat}`);
          }
          formattedNumber = value == 0 ? '' : value.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
          break;
        default:
          formattedNumber = value.toString();
          break;
      }
      return formattedNumber;
    } else if (type === 'string' || type === '' || type === 'text') {
      if (dataFormatString === dataFormat.lowercaseFormat) {
        return value.toLowerCase();
      } else if (dataFormatString === dataFormat.upperCaseFormat) {
        return value.toUpperCase();
      }
      else if (dataFormatString === dataFormat.datetimeFormat) {
        if (!value || value == '') return '';
        return formatDate(value, dataFormatString, 'en_US');
      }
      else if (dataFormatString === dataFormat.fullDateTimeFormat) {
        if (!value || value == '') return '';
        return formatDate(value, dataFormatString, 'en_US');
      }
    } else if (type === 'date') {
      if (dataFormatString === dataFormat.datetimeFormat) {
        if (!value || value == '') return '';
        return formatDate(value, dataFormatString, 'en_US');
      }
    }
    else if (type === 'time') {
      if (!value || value === '') return '';
      // Nếu backend trả ISO: 2026-02-27T14:35:12
      if (typeof value === 'string' && value.includes('T')) {
        return value.substring(11, 16); // HH:mm
      }

      // Nếu backend trả dạng HH:mm:ss
      if (typeof value === 'string' && value.length >= 5) {
        return value.substring(0, 5);
      }

      // Nếu là Date object
      return formatDate(value, 'HH:mm', 'en_US');
    }
    else if (type === 'mask') {
      if (!value || value === '') return '';
      const strValue = value.toString().trim();
      const len = strValue.length;
      if (len <= 5) return strValue;
      const masked = '*'.repeat(len - 5);
      return masked + strValue.slice(-5);
    }

    return value;
  }
}


@NgModule({
  imports: [],
  exports: [DataFormatPipe],
  declarations: [DataFormatPipe]
})
export class DataFormatPipeModule { }
