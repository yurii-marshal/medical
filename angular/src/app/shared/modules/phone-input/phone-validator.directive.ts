import {
    Attribute,
    Directive,
    forwardRef,
} from '@angular/core';

import {
    AbstractControl,
    NG_VALIDATORS,
    Validator,
    ValidatorFn,
} from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
    const phoneRegExp = new RegExp(/^[0-9]{10}$/);

    return (control: AbstractControl): {[key: string]: any} | null => {

        if (!control.value || phoneRegExp.test(control.value)) {
            return null;
        }

        return { phoneNumber: true };
    };
}


@Directive({
    selector: '[appPhoneNumberValidator][formControlName],[appPhoneNumberValidator][formControl],[appPhoneNumberValidator][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => PhoneNumberValidatorDirective),
            multi: true,
        },
    ],
})
export class PhoneNumberValidatorDirective implements Validator {

    constructor( @Attribute('validateEqual') public validateEqual: string) {}

    validate(control: AbstractControl): {[key: string]: any} | null {
        return phoneNumberValidator()(control);
    }
}
