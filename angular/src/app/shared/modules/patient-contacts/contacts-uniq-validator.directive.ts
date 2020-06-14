import {
    Attribute,
    Directive,
    forwardRef,
    Input,
    OnInit,
} from '@angular/core';
import {
    FormControl,
    NG_VALIDATORS,
    Validator,
} from '@angular/forms';
import {
    SourceContactTypes,
} from './patient-contacts.enum';
import { getCotactsTypesIds } from './helper';
import { ContactsTypesIds } from './patient-contacts.interfaces';

// This validator for matching same contacts
@Directive({
    selector: '[appContactsUniqValidator][formArrayName]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ContactsUniqValidatorDirective),
            multi: true,
        },
    ],
})
export class ContactsUniqValidatorDirective implements Validator, OnInit {

    @Input() sourceContacts: SourceContactTypes;

    public contactsTypesIds: ContactsTypesIds;

    constructor(@Attribute('validateEqual') public validateEqual: string) {
    }

    public validate(formArrayControl: any): { [key: string]: any } {

        let isHasNotUniq = false;

        // Remove all prev uniq error before check and set
        formArrayControl.controls.forEach((formGroup) => {
            this.removeUniqValueError(formGroup.controls.phone);
            this.removeUniqValueError(formGroup.controls.email);
            this.removeUniqValueError(formGroup.controls.website);
        });

        formArrayControl.controls.forEach((formGroup, index) => {

            for (let i = index + 1; i < formArrayControl.controls.length; i++) {
                const formGroupForCompare = formArrayControl.controls[i];

                // Check phones and set error
                if (formGroup.controls.type.value !== this.contactsTypesIds.EMAIL_ID &&
                    formGroup.controls.type.value !== this.contactsTypesIds.WEBSITE_ID &&
                    formGroupForCompare.controls.type.value !== this.contactsTypesIds.EMAIL_ID &&
                    formGroupForCompare.controls.type.value !== this.contactsTypesIds.WEBSITE_ID
                ) {
                    isHasNotUniq = this.validateControls(formGroup.controls, formGroupForCompare.controls, 'phone');
                }

                // Check emails and set error
                if (formGroup.controls.type.value === this.contactsTypesIds.EMAIL_ID &&
                    formGroupForCompare.controls.type.value === this.contactsTypesIds.EMAIL_ID
                ) {
                    isHasNotUniq = this.validateControls(formGroup.controls, formGroupForCompare.controls, 'email');
                }

                // Check website and set error
                if (formGroup.controls.type.value === this.contactsTypesIds.WEBSITE_ID &&
                    formGroupForCompare.controls.type.value === this.contactsTypesIds.WEBSITE_ID
                ) {
                    isHasNotUniq = this.validateControls(formGroup.controls, formGroupForCompare.controls, 'website');
                }
            }

        });

        if (formArrayControl.value && isHasNotUniq) {
            return {
                hasNotUniqValues: true,
            };
        }

        return null;
    }

    ngOnInit() {
        this.contactsTypesIds = getCotactsTypesIds(this.sourceContacts);
    }

    public removeUniqValueError(control: FormControl) {
        const errors = control.errors;

        if (errors) {
            delete errors.notUniqValue;
            control.setErrors(Object.keys(errors).length ? errors : null);
        }
    }

    public validateControls(comparedControlsFirst, comparedControlsSecond, formControlName): boolean {
        let isHasNotUniq = false;

        if (comparedControlsFirst[formControlName].value &&
            comparedControlsSecond[formControlName].value &&
            comparedControlsFirst[formControlName].value === comparedControlsSecond[formControlName].value) {

            comparedControlsFirst[formControlName].setErrors({notUniqValue: true});
            comparedControlsSecond[formControlName].setErrors({notUniqValue: true});

            isHasNotUniq = true;
        }

        return isHasNotUniq;
    }
}
