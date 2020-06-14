import {
    Component,
    EventEmitter,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { ProfileService } from '@shared/services/profile.service';
import { markFormGroupTouched } from '@shared/helpers/touch-error-fields';
import { RouterNavigatorService } from '@shared/services/navigation-router.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { noWhitespaceValidator } from '@shared/validators/white-space.validator';
import { LoginComponentService } from 'app/auth/components/login/login-component.service';
import { Login } from '../../../../shared/interfaces/login.interface';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [],
})

export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public isLoading = false; // to disable inputs during loading

    @Output() changeToEnterCode = new EventEmitter<Login>();

    constructor(
        private router: Router,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private authService: AuthService,
        private profileService: ProfileService,
        private routerNavigator: RouterNavigatorService,
        private localStorageService: LocalStorageService,
        private loginComponentService: LoginComponentService,
    ) {
        this.iconRegistry.addSvgIcon(
            'user-circle',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/colored/user-circle.svg'));
        this.iconRegistry.addSvgIcon(
            'lock-circle',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/colored/lock-circle.svg'));

        this.loginForm = fb.group({
            username: ['', [Validators.required, noWhitespaceValidator]],
            password: ['', [Validators.required]],
            remember: false,
        });
    }

    ngOnInit() {
        if (this.authService.getAccessToken()) {
            this.routerNavigator.navigate(['/dashboard']);
            return;
        }

        this.checkRememberUser();
    }

    public submitForm(event: KeyboardEvent): void {
        if (event.keyCode === 13) {
            if (this.isLoading) {
                return;
            }
            this.login();
        }
    }

    public login(): void {
        if (this.loginForm.invalid) {
            markFormGroupTouched(this.loginForm);
            return;
        }

        this.isLoading = true;
        this.authService.login({
            username: this.loginForm.value.username.trim(),
            password: this.loginForm.value.password.trim(),
        })
        .subscribe(
            () => {
                this.loginComponentService.loginSuccess({
                    isRemember: this.loginForm.value.remember,
                    username: this.loginForm.value.username,
                });
            },
            (error) => {

                if (error.error.mfa_token) {
                    this.changeToEnterCode.emit({
                        isRemember: this.loginForm.value.remember,
                        username: this.loginForm.value.username,
                    });
                }
                this.isLoading = false;
            });
    }

    private checkRememberUser() {
        const remember = this.localStorageService.get('rememberLogin');

        if (remember) {
            this.loginForm.patchValue({
                username: remember,
                remember: true,
            });
        }
    }
}
