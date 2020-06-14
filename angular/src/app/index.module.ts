// @angular core modules
import {
    APP_INITIALIZER,
    NgModule,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    HTTP_INTERCEPTORS,
    HttpClientModule,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// guards
import { RedirectToAuthGuard } from '@shared/guards/redirect-to-auth.guard';
import { CompodocGuard } from '@shared/guards/compodoc.guard';

// third-party libraries
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import * as moment from 'moment';
import 'moment-duration-format';
import { LoadingModule } from '@shared/modules';
import { ToastrModule } from 'ngx-toastr';

// app modules
import { HeadersInterceptor } from '@shared/interceptors/headers-interceptor';
import { RefreshTokenInterceptor } from './shared/interceptors/refresh-token-interceptor';
import { appRoutes } from './index.route';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { NoContentModule } from '@shared/modules';
import { NoLayoutModule } from './core/layouts/no-layout/no-layout.module';
import { MainLayoutModule } from './core/layouts/main-layout/main-layout.module';
import { PubSubModule } from '@shared/modules/pub-sub.module';

// app components
import { IndexComponent } from './index.component';
import { SessionTimerComponent } from './auth/components/session-timer/session-timer.component';

// app services
import { RouterNavigatorService } from '@shared/services/navigation-router.service';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from '@shared/services/profile.service';

import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LocalStorageModule } from 'angular-2-local-storage';
import {
    userPermissionsFactory,
    UserPermissionsService,
} from '@shared/services/user-permissions.service';
import { CrossTabNotifierService } from '@shared/services/crosstab-notifier.service';
import { NavigationData } from '@shared/services/navigation-data.service';
import { ServicesModule } from './core/services.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
};

@NgModule({
    declarations: [
        IndexComponent,
        SessionTimerComponent,
    ],
    imports: [
        ServicesModule,
        BrowserModule,
        MainLayoutModule,
        NoLayoutModule,
        SharedModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(
            appRoutes, {
                useHash: true,
            },
        ),
        ToastrModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        AuthModule,
        NoContentModule,
        LoadingModule,
        FormsModule,
        LocalStorageModule.withConfig({
            prefix: '',
            storageType: 'localStorage',
        }),

        /*
        * This module has service for work with localStorage like module above
        * But we need different prefix for sessionStorage for communicate with Ang1 app
        * In the future we have to improve this situation
        */
        PubSubModule.forRoot(),
    ],
    entryComponents: [SessionTimerComponent],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
        RouterNavigatorService,
        CookieService,
        UserPermissionsService,
        {
            provide: APP_INITIALIZER,
            useFactory: userPermissionsFactory,
            deps: [UserPermissionsService],
            multi: true,
        },
        ProfileService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeadersInterceptor,
            multi: true,
        },
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: RefreshTokenInterceptor,
        //     multi: true,
        // },
        {
            provide: 'moment',
            useFactory: (): any => moment,
        },
        CrossTabNotifierService,
        RedirectToAuthGuard,
        CompodocGuard,
        NavigationData,
    ],
    bootstrap: [IndexComponent],
})

export class AppModule {}
