import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

import { AuthService } from '../../../../shared/services/auth.service';
import { ToasterService } from '@shared/services/toaster.service';
import { markFormGroupTouched } from '@shared/helpers/touch-error-fields';
import { RouterNavigatorService } from '@shared/services/navigation-router.service';
import { UserPermissionsService } from '@shared/services/user-permissions.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { CrossTabNotifierService } from '@shared/services/crosstab-notifier.service';
import { ProfileService } from '@shared/services/profile.service';
import { LoginComponentService } from '@app/auth/components/login/login-component.service';
import { IdentityEndpointsService } from '@shared/endpoints/identity/identity.edpoints';
import { Login } from '../../../../shared/interfaces/login.interface';

@Component({
    selector: 'app-two-factor-auth',
    templateUrl: './two-factor-auth.component.html',
    styleUrls: [],
})

export class TwoFactorAuthComponent {
    public form: FormGroup;

    public isLoading = false;

    @Input() data: Login;

    @Output() changeToLogin = new EventEmitter<void>();

    constructor(private router: Router,
                private iconRegistry: MatIconRegistry,
                private sanitizer: DomSanitizer,
                private fb: FormBuilder,
                private authService: AuthService,
                private toasterService: ToasterService,
                private routerNavigator: RouterNavigatorService,
                private userPermissionsService: UserPermissionsService,
                private localStorageService: LocalStorageService,
                private tabNotifier: CrossTabNotifierService,
                private profileService: ProfileService,
                private loginComponentService: LoginComponentService,
                private identityEndpointsService: IdentityEndpointsService,
    ) {

        this.iconRegistry.addSvgIcon(
            'user-circle',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/colored/user-circle.svg'));

        this.form = fb.group({
            code: ['', [Validators.required]],
        });
    }

    submitForm() {

        if (this.form.invalid) {
            markFormGroupTouched(this.form);
            return;
        }

        this.authService.sendTwoFactorCode(this.form.controls.code.value).subscribe(
            () => {
                 this.loginComponentService.loginSuccess({
                     isRemember: this.data.isRemember,
                     username: this.data.username,
                 });
            },
            () => {
                this.isLoading = false;
            });

    }

    resendCode() {
        this.identityEndpointsService.resendTwoFactorCode(this.authService.getMFAToken())
            .subscribe(() => {

                this.form.controls.code.setValue('');

                this.toasterService.showToaster(
                    `Code was sent successfully.`,
                    ['success', 'nikoToast'],
                );
        });
    }
}
