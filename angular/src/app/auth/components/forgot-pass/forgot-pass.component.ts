import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched } from '@shared/helpers/touch-error-fields';

import { AuthService } from '../../shared/services/auth.service';
import { ToasterService } from '@shared/services/toaster.service';

import { ForgotPassRequest } from './forgot-pass.interface';

@Component({
    selector: 'app-forgot-pass',
    templateUrl: './forgot-pass.component.html',
    styleUrls: [],
})

export class ForgotPassComponent {
    public forgotPassForm: FormGroup;
    public isLoading = false; // to disable inputs during loading

    public email: string;

    constructor(private router: Router,
                private iconRegistry: MatIconRegistry,
                private sanitizer: DomSanitizer,
                private fb: FormBuilder,
                private authService: AuthService,
                private toasterService: ToasterService) {

        this.iconRegistry.addSvgIcon(
            'user-circle',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/colored/user-circle.svg'));
        this.iconRegistry.addSvgIcon(
            'email-circle',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/colored/email-circle.svg'));

        this.forgotPassForm = fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
        });
    }

    submitForm(event: KeyboardEvent): void {
        if (event.keyCode === 13) {
            if (this.isLoading) {
                return;
            }
            this.resetPass();
        }
    }

    resetPass(): void {

        if (this.forgotPassForm.invalid) {
            markFormGroupTouched(this.forgotPassForm);
            return;
        }

        const remindModel: ForgotPassRequest = {
            Login: this.forgotPassForm.get('username').value.trim(),
            Email: this.forgotPassForm.get('email').value.trim(),
        };

        this.isLoading = true;
        this.authService.remindPass(remindModel)
            .subscribe(
                () => {
                    this.toasterService.showToaster(
                        `Your new password was sent to email`,
                        ['success', 'nikoToast', 'top-20'],
                        'toast-container-for-login',
                    );
                    this.router.navigate(['/login']);
                    this.isLoading = false;
                },
                () => {

                    this.toasterService.showToaster(
                        `User email and provided email distinct.`,
                        ['danger', 'nikoToast', 'top-20'],
                        'toast-container-for-login',
                    );

                    this.isLoading = false;
                });
    }

}
