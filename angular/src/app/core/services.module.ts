import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// Mock services
import { SettingDictionariesEndpointsMockService } from '@shared/endpoints/core/settings-dictionaries/setting-dictionaries.endpoints.mock';

// Services
import { IdentityEndpointsService } from '@shared/endpoints/identity/identity.edpoints';
import { UserNotificationsEndpointsService } from '@shared/endpoints/core/user-notifications/user-notifications.endpoints';
import { PatientEndpointsService } from '@shared/endpoints/core/patient/patient.endpoints';
import { UsersEndpointsService } from '@shared/endpoints/core/users/users.endpoints';
import { ReportsEndpointsService } from '@shared/endpoints/core/reports/reports.endpoints';
import { NlpEndpointsService } from '@shared/endpoints/nlp/nlp.endpoints';
import { SettingDictionariesEndpointsService } from '@shared/endpoints/core/settings-dictionaries/setting-dictionaries.endpoints';
import { TagsEndpointsService } from '@shared/endpoints/core/tags/tags.endpoints';
import { DictionariesEndpointsService } from '@shared/endpoints/core/dictionaries/dictionaries.endpoints';
import { TemplatesEndpointsService } from '@shared/endpoints/templates/templates.endpoints';
import { GridStateService } from '@shared/services/grid-state.service';
import { ToasterService } from '@shared/services/toaster.service';
import {
    OrganizationLocationsEndpointsService,
} from '@shared/endpoints/organizations/organization-locations/organization-locations.endpoints';
import { ErrorMessageHelperService } from '@shared/helpers/services/error-message-helper.service';
import { TokenService } from '@shared/services/token.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        IdentityEndpointsService,
        UserNotificationsEndpointsService,
        UsersEndpointsService,
        ReportsEndpointsService,
        GridStateService,
        PatientEndpointsService,
        TagsEndpointsService,
        DictionariesEndpointsService,
        TemplatesEndpointsService,
        SettingDictionariesEndpointsService,
        NlpEndpointsService,
        ToasterService,
        OrganizationLocationsEndpointsService,
        ErrorMessageHelperService,
        TokenService,
    ],
    declarations: [],
})
export class ServicesModule {
    /**
     * Define static forDemo method for swap service with http request to service with mock data,
     * for using inside compodoc demo components and prevent logout from documentation because of http
     * request and interceptors.
     *
     * By default Angular will inject a provider with the same class name and token,
     * but useClass allows to use a different class.
     */
    static forDemo(): ModuleWithProviders {
        return {
            ngModule: ServicesModule,
            providers: [
                // {
                //     provide: PatientEndpointsService,
                //     useClass: PatientEndpointsMockService
                // },
                // {
                //     provide: TagsEndpointsService,
                //     useClass: TagsEndpointsMockService,
                // },
                // {
                //     provide: DictionariesEndpointsService,
                //     useClass: DictionariesEndpointsMockService
                // },
                {
                    provide: SettingDictionariesEndpointsService,
                    useClass: SettingDictionariesEndpointsMockService,
                },
            ],
        };
    }
}
