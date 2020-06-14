import { NgModule } from '@angular/core';

import { LoginComponent } from './components/login/components/login/login.component';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { ChangePassComponent } from './components/change-pass/change-pass.component';

import { RouterModule } from '@angular/router';
import { authRoutes } from './auth.route';

import { SharedModule } from '@shared/shared.module';
import { AuthService } from './shared/services/auth.service';
import { RedirectFromAuthGuard } from './guards/redirect-from-auth.guard';
import { TwoFactorAuthComponent } from '@app/auth/components/login/components/two-factor-auth/two-factor-auth.component';
import { StateAutocompleteModule } from '@shared/modules/spell-text-input/spell-text-input.module';
import { LoginComponentService } from '@app/auth/components/login/login-component.service';
import { LoginContainerComponent } from '@app/auth/components/login/login-container.component';

@NgModule({
    declarations: [
        LoginComponent,
        ForgotPassComponent,
        ChangePassComponent,
        TwoFactorAuthComponent,
        LoginContainerComponent,
    ],
    imports: [
        RouterModule.forRoot(
            authRoutes, {
                useHash: true,
            },
        ),
        SharedModule,
        StateAutocompleteModule,
    ],
    providers: [
        AuthService,
        RedirectFromAuthGuard,
        LoginComponentService,
    ],
})
export class AuthModule {
}
