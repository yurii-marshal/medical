import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'phone'})
export class PhonePipe implements PipeTransform {
    transform(phone: string): string {

        if (!phone) {
            return '';
        }

        let value = phone.toString();

        // delete " " and "+"
        value = value.trim().replace(/^\+/, '');

        // consist not Numbers
        if (value.match(/[^0-9]/)) {
            return value;
        }

        switch (value.length) {
            // mobile phone
            case 10:
                return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            // other types
            default:
                return value;
        }
    }
}
