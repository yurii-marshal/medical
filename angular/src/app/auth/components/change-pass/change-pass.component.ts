import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { markFormGroupTouched } from '@shared/helpers/touch-error-fields';

import { AuthService } from '../../shared/services/auth.service';
import { ToasterService } from '@shared/services/toaster.service';

import { ChangePassRequest } from './change-pass.interface';
import { MatchValuesValidator } from '@shared/helpers/match-values-validator';

@Component({
    selector: 'app-forgot-pass',
    templateUrl: './change-pass.component.html',
    styleUrls: [],
})

export class ChangePassComponent implements OnInit {
    public changePassForm: FormGroup;

    public passwordRegExp = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';
    public isLoading = false; // to disable inputs during loading

    /**
     * @method - New password field validator function. Bound confirmPassword field
     * @returns { Boolean } Valid field status
     */
    private newPassFieldValidator(): boolean {
        let isFieldValid;

        if (this.changePassForm) {
            const newPassword =  this.changePassForm.get('newPassword').value;

            isFieldValid = newPassword.length;

            this.changePassForm.controls.confirmPassword.updateValueAndValidity();

            if (this.changePassForm.get('confirmPassword').value.length > 0
                && isFieldValid) {
                this.changePassForm.controls.confirmPassword.markAsTouched();
            }
        }

        return isFieldValid;
    }

    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private authService: AuthService,
        private toasterService: ToasterService,
    ) {

        /**
         * @description - registration icons url for using in html attr
         */
        this.iconRegistry.addSvgIcon(
            'lock-circle',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/colored/lock-circle.svg'));

        /**
         * @description - form validations rules
         * @type {FormGroup}
         */
        this.changePassForm = fb.group(
            {
                oldPassword: ['', [Validators.required]],
                newPassword: ['', [
                        this.conditionalPassValidator(
                            this.newPassFieldValidator.bind(this),
                            Validators.required,
                        ),
                        Validators.pattern(this.passwordRegExp),
                        Validators.required,
                    ],
                ],
                confirmPassword: ['', [
                        this.conditionalPassValidator(
                            (() => {
                                return this.changePassForm &&
                                    this.changePassForm.get('confirmPassword').value &&
                                    this.changePassForm.controls.newPassword.valid;
                            }),
                            Validators.required,
                        ),
                        Validators.required,
                    ],
                ],
            },
            {
                validator: this.conditionalPassValidator(
                    (() => {
                        return this.changePassForm &&
                            this.changePassForm.get('confirmPassword').dirty &&
                            (this.changePassForm.get('newPassword').value || this.changePassForm.get('confirmPassword').value);
                    }),
                    MatchValuesValidator.Match('newPassword', 'confirmPassword'),
                ),
            },
        );
    }

    /**
     * @method - Conditionally setting up password validators
     * @param {() => FormGroup} condition
     * @param {ValidatorFn} validator
     * @returns {ValidatorFn}
     */
    private conditionalPassValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            if (!condition()) {
                return null;
            }
            return validator(control);
        };
    }

    ngOnInit() {
        /**
         * @description - check route data EMAIL
         */
        if (!this.activatedRouter.snapshot.params.email) {
            this.authService.logout();

            this.router.navigate(['/login']);

            this.toasterService.showToaster(
                `Please log in with our temporary password`,
                ['danger', 'nikoToast', 'top-20'],
                'toast-container-for-login',
            );
        }
    }

    public setNewPassErrorClass(): boolean {
        return this.changePassForm.controls.newPassword.errors &&
            this.changePassForm.controls.newPassword.errors.pattern &&
            this.changePassForm.controls.newPassword.touched;
    }

    public submitForm(event: KeyboardEvent): void {
        if (event.keyCode === 13) {
            if (this.isLoading) {
                return;
            }
            this.saveNewPass();
        }
    }

    public saveNewPass(): void {
        if (this.changePassForm.invalid) {
            markFormGroupTouched(this.changePassForm);
            return;
        }

        const updateProfileModel: ChangePassRequest = {
            Email: this.activatedRouter.snapshot.params.email,
            NewPassword: this.changePassForm.get('newPassword').value.trim(),
            Password: this.changePassForm.get('oldPassword').value.trim(),
        };

        this.isLoading = true;
        this.authService.changePass(updateProfileModel)
            .subscribe(
                () => {

                    this.toasterService.showToaster(
                        `Your password has changed`,
                        ['success', 'nikoToast', 'top-20'],
                        'toast-container-for-login',
                    );
                    this.authService.logout();
                    this.router.navigate(['/login']);
                },
                (err) => {
                    const error = err.error.Error ? err.error.Error.join('\n') : err.error.error.message;

                    this.toasterService.showToaster(
                        error,
                        ['danger', 'nikoToast', 'top-20'],
                        'toast-container-for-login',
                    );

                    this.isLoading = false;
                });
    }

    public cancel(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
