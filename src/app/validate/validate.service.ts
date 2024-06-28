import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ValidateService {
    constructor() {
        //
    }
    isValidEmail(email: string): boolean {
        // Custom validation logic here
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    isPhoneNumber(phone: string): boolean {
        const phoneRegex = /^0[0-9]{9,10}$/;
        return phoneRegex.test(phone);
    }
    checkValidate(control: Validator) {
        //
    }
}