import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    PatientShortInfoSidebarModule,
    SubTabsModule,
} from '@shared/modules';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';
import { SERVICES } from './services';
import { SidebarModule } from '@app/core/sidebar/sidebar.module';

@NgModule({
    imports: [
        CommonModule,
        SubTabsModule,
        SidebarModule,
        PatientShortInfoSidebarModule,
        PatientRoutingModule,
    ],
    declarations: [
        PatientComponent,
    ],
    providers: [
        ...SERVICES,
    ],
})
export class PatientModule {
}
