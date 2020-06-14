import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AssignPdfFieldComponent } from '@shared/modules/assign-pdf-field/assign-pdf-field.component';
import { AssignPdfFieldService } from '@shared/modules/assign-pdf-field/assign-pdf-field.service';

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        AssignPdfFieldComponent,
    ],
    exports: [
        SharedModule,
        AssignPdfFieldComponent,
        ReactiveFormsModule,
    ],
    providers: [AssignPdfFieldService],
})
export class AssignPdfFieldModule {
}
