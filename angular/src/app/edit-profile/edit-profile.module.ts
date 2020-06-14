import { NgModule } from '@angular/core';
import { EditProfileComponent } from './edit-profile.component';
import { ConfirmProfileChangesComponent } from './modals/confirm-profile-changes/confirm-profile-changes.component';
import { EditProfileRoutingModule } from './edit-profile.routing.module';
import { SharedModule } from '@shared/shared.module';
import { LoadingModule } from '@shared/modules/loading/loading.module';
import { EmailInputModule } from '@shared/modules/email-input/email-input.module';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
    declarations: [
        EditProfileComponent,
        ConfirmProfileChangesComponent,
    ],
    imports: [
        EditProfileRoutingModule,
        SharedModule,
        LoadingModule,
        EmailInputModule,
        FileUploadModule,
    ],
    entryComponents: [ConfirmProfileChangesComponent],
})

export class EditProfileModule {
}
