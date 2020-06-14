import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PatientShortInfoSidebarComponent } from './patient-short-info-sidebar.component';
import { LoadingModule } from '@shared/modules/loading/loading.module';
import { AttrsTagsModule } from '@shared/modules/attrs-tags/attrs-tags.module';
import { DateTimePickerModule } from '@shared/modules/datepicker/datepicker.module';
import { VAccordionModule } from '@shared/modules/v-accordion/v-accordion.module';
import { NoContentModule } from '@shared/modules/no-content/no-content.module';
import { EditPatientAttrsModalComponent } from './modals/edit-patient-attrs-modal/edit-patient-attrs-modal.component';

@NgModule({
    declarations: [
        EditPatientAttrsModalComponent,
        PatientShortInfoSidebarComponent,
    ],
    imports: [
        SharedModule,
        LoadingModule,
        AttrsTagsModule,
        VAccordionModule,
        NoContentModule,
        DateTimePickerModule,
    ],
    providers: [],
    exports: [
        PatientShortInfoSidebarComponent,
    ],
    entryComponents: [
        EditPatientAttrsModalComponent,
    ],
})

export class PatientShortInfoSidebarModule {
}
