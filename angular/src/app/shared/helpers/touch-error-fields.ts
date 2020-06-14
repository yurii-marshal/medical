/**
 * Marks all controls in a form group as touched
 * @param formGroup - The group to caress
 */
import {
    FormArray,
    FormGroup,
} from '@angular/forms';

export function markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
        control.markAsTouched();

        if (control instanceof FormGroup) {
            (<any>control).controls.forEach((c) => this.markFormGroupTouched(c));
        } else if (control instanceof FormArray) {
            control.controls.forEach((formGrpup: FormGroup) => {
                Object.keys(formGrpup.controls).forEach((key) => {
                    formGrpup.controls[key].markAsTouched();
                });
            });
        }
    });
}
