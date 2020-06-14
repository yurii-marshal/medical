import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-confirm-profile-changes',
    templateUrl: './confirm-profile-changes.component.html',
    styleUrls: ['./confirm-profile-changes.component.scss'],
})

export class ConfirmProfileChangesComponent {
    public confirmProfileChangesForm: FormGroup;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ConfirmProfileChangesComponent>,
    ) {
        /**
         * @description - registration icons url for using in html attr
         */
        this.iconRegistry.addSvgIcon(
            'lock',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/lock.svg'));

        /**
         * @description - form validations rules
         * @type {FormGroup}
         */
        this.confirmProfileChangesForm = fb.group(
            {
                password: ['', [Validators.required] ],
            },
        );
    }

    public save(): void {
        this.dialogRef.close(this.confirmProfileChangesForm.get('password').value);
    }

    public cancel(): void {
        this.dialogRef.close();
    }

    public submitForm(event: KeyboardEvent): any {
        if (event.keyCode === 13) {
            this.save();
        }
    }
}
