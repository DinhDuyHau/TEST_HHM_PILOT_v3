import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { DateMask, IDateMaskOptional } from './DateMask';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-input-date',
    templateUrl: './input-date.component.html',
    styleUrls: ['./input-date.component.scss']
})
export class InputDateComponent implements OnChanges, OnInit, AfterViewInit {
    @ViewChild('date_textbox') input!: ElementRef;

    @Output() handleKeyUp = new EventEmitter<any>();
    @Output() handleBlur = new EventEmitter<any>();
    @Output() handleChangeValue = new EventEmitter<any>();

    date_text: string = '';
    date_value!: Date | null;
    format: any = 'dd/mm/yyyy';

    @Input() cssClass: string = '';

    test_focus() {
        console.log('focus')
    }

    constructor() {

    }

    ngOnInit(): void {

    }

    ngAfterViewInit() {
        const date_textbox: HTMLInputElement = this.input.nativeElement as HTMLInputElement;
        new DateMask(date_textbox, { mask: this.format });
        date_textbox.value = this.date_text;
        date_textbox.setSelectionRange(0, 0);
    }

    public get value(): Date | null {
        return this.date_value;
    }

    @Input() public set value(date: Date | null) {
        if (date !== null) {
            this.date_value = date!;
            this.date_text = this.convert2ddMMyyyy(this.date_value!);
        }
    }

    public get text(): string {
        return this.date_text;
    }

    @Input() public set text(date: string) {
        let input_date = date;
        if (date && date.length > 0 && date.indexOf('-') > 0) {
            input_date = this.convertFromYYYYMMDD(date);
        }

        this.date_value = this.convertString2Date(input_date, '/');
        if (this.date_value)
            this.date_text = this.convert2ddMMyyyy(this.date_value);
    }

    public get shortDateString() {
        return this.convert2ddMMyyyy(this.date_value!);
    }

    public get isoDateString() {
        return formatDate(this.date_value!, 'yyyy-MM-dd', 'en_US');
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    //Kiểm tra hợp lệ của dữ liệu ngày tháng
    checkValidDate(year: number, month: number, day: number): boolean {
        if (month < 0 || month > 11) return false;       //tháng tính từ 0 -> 11

        let max_day = 0;
        if (month === 0) max_day = 31;                               //tháng 1
        if (month === 1) max_day = year % 4 === 0 ? 29 : 28;         //tháng 2
        if (month === 2) max_day = 31;                               //tháng 3
        if (month === 3) max_day = 30;                               //tháng 4
        if (month === 4) max_day = 31;                               //tháng 5
        if (month === 5) max_day = 30;                               //tháng 6
        if (month === 6) max_day = 31;                               //tháng 7
        if (month === 7) max_day = 31;                               //tháng 8
        if (month === 8) max_day = 30;                               //tháng 9
        if (month === 9) max_day = 31;                               //tháng 10
        if (month === 10) max_day = 30;                              //tháng 11
        if (month === 11) max_day = 31;                              //tháng 12

        if (day < 1 || day > max_day) return false;

        return true;
    }

    //chuyển đổi date sang string theo định dạng dd/MM/yyyy
    convert2ddMMyyyy(date: Date) {
        const yyyy = date.getFullYear();
        const mm = date.getMonth() + 1; // Months start at 0!
        const dd = date.getDate();

        const date_formatted = (dd < 10 ? ('0' + dd) : dd) + '/' + (mm < 10 ? ('0' + mm) : mm) + '/' + yyyy;
        return date_formatted;
    }

    convertFromYYYYMMDD(date: string, seperator = '-'): string {
        let new_date = date;
        if (date && date.length > 0 && date.indexOf(seperator) > 0) {
            const arr = date.split(seperator);
            if (arr && arr.length === 3) {
                //change format yyyy-MM-dd to dd/MM/yyyy
                new_date = arr[2] + '/' + arr[1] + '/' + arr[0];
            }
        }
        return new_date;
    }

    onDatePickupChange(event: any) {
        const date = (event.target as HTMLInputElement).value;
        let year = 0, month = 0, day = 0;
        if (date && date.length > 0 && date.indexOf('-') > 0) {
            const arr = date.split('-');
            if (arr && arr.length === 3) {
                //format: yyyy-MM-dd
                year = parseInt(arr[0]);
                month = parseInt(arr[1]) - 1;
                day = parseInt(arr[2]);
            }
        }

        if (this.checkValidDate(year, month, day)) {
            this.date_value = new Date(year, month, day);
            const yyyy = year;
            const mm = month + 1; // Months start at 0!
            const dd = day;
            const date_formatted = (dd < 10 ? ('0' + dd) : dd) + '/' + (mm < 10 ? ('0' + mm) : mm) + '/' + yyyy;
            this.date_text = date_formatted;
        }
    }

    convertString2Date(str: string, seperator: string): Date | null {
        let date = null;
        const current_date = new Date();
        let year = 0, month = 0, day = 0;
        if (str && str.length > 0 && str.indexOf(seperator) > 0) {
            const arr = str.split(seperator);
            if (arr && arr.length === 3) {
                day = parseInt(arr[0]);
                month = parseInt(arr[1]) - 1;
                year = parseInt(arr[2]);

                day = isNaN(day) ? current_date.getDate() : day;
                month = isNaN(month) ? current_date.getMonth() : month;
                year = isNaN(year) ? current_date.getFullYear() : year;

                if (this.checkValidDate(year, month, day)) {
                    date = new Date(year, month, day);
                }
            }
        }
        return date;
    }

    onDateTextboxKeyUp(event: any) {
        if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
            event.preventDefault();
            this.handleKeyUp.emit(event);
        }
    }

    onBlur(event: any, ref: any) {
        const date: string = ref.value.toString().trim();
        const input_date = this.convertString2Date(date, '/');
        if (input_date) {
            this.date_value = input_date;
            this.date_text = this.convert2ddMMyyyy(this.date_value!);
            ref.value = this.date_text;
        }
        else {
            //ngày nhập không hợp lệ => reset về ngày hiện tại
            this.date_value = new Date();
            this.date_text = this.convert2ddMMyyyy(this.date_value);
            ref.value = this.date_text;
        }

        this.handleBlur.emit(event);
    }

    onChangeValue(event: any) {
        this.handleChangeValue.emit(this.date_value);
    }

    onBlurDatePickup(event: any) {
        this.handleBlur.emit(event);
    }

}