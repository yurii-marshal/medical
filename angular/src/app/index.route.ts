import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { RedirectToAuthGuard } from '@shared/guards/redirect-to-auth.guard';
import { CompodocGuard } from '@shared/guards/compodoc.guard';
import { NoLayoutComponent } from './core/layouts/no-layout/no-layout.component';
import { RedirectFromAuthGuard } from '@app/auth/guards/redirect-from-auth.guard';
import { ForgotPassComponent } from '@app/auth/components/forgot-pass/forgot-pass.component';
import { ChangePassComponent } from '@app/auth/components/change-pass/change-pass.component';
import { TwoFactorAuthComponent } from '@app/auth/components/login/components/two-factor-auth/two-factor-auth.component';
import { LoginContainerComponent } from '@app/auth/components/login/login-container.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: NoLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginContainerComponent,
                canActivate: [RedirectFromAuthGuard],
                data: {title: 'Login'},
            },
            // {
            //     path: 'two-factor-authentication',
            //     component: TwoFactorAuthComponent,
            //     canActivate: [RedirectFromAuthGuard],
            //     data: {title: 'Two Factor Authentication'}
            // },
            {
                path: 'forgotpass',
                component: ForgotPassComponent,
                canActivate: [RedirectFromAuthGuard],
                data: {title: 'Forgot Password'},
            },
            {
                path: 'changepass',
                component: ChangePassComponent,
                data: {title: 'Change Password'},
            },
            {
                path: 'demo-components',
                canActivate: [CompodocGuard],
                loadChildren: './demo/demo-components/demo-components.module#DemoComponentsModule',
                data: {title: 'Demo Components'},
            },
            {
                path: 'markups',
                canActivate: [CompodocGuard],
                loadChildren: './demo/elements-markups/elements-markups.module#ElementsMarkupsModule',
                data: {title: 'Demo Markups'},
            },
            {
                path: '',
                component: MainLayoutComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'dashboard',
                        pathMatch: 'full',
                    },
                    {
                        path: 'edit-profile',
                        canActivate: [RedirectToAuthGuard],
                        loadChildren: './edit-profile/edit-profile.module#EditProfileModule',
                        data: {title: 'Edit Profile', topMenu: 'Edit Profile'},
                    },
                    /** @todo: rename to patients when whole angularjs patients module will be replaced with angular 2+ */
                    {
                        path: 'patients-v2',
                        canActivate: [RedirectToAuthGuard],
                        loadChildren: './patients/patients.module#PatientsModule',
                        data: {title: 'Patients', topMenu: 'Patients'},
                    },
                    {
                        path: '**',
                        canActivate: [RedirectToAuthGuard],
                        loadChildren: './page-not-found/page-not-found.module#PageNotFoundModule',
                    },
                ],
            },
        ],
    },
];
