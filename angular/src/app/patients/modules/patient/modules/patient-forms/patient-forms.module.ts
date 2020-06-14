import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { LoadingModule } from '@shared/modules';
import { AssignPdfFieldModule } from '@shared/modules/assign-pdf-field/assign-pdf-field.module';
import { PdfFormReviewModule } from '@shared/modules/pdf-form-review/pdf-form-review.module';

import { PatientFormsRoutingModule } from './patient-forms-routing.module';
import { PatientFormsComponent } from './patient-forms.component';
import { COMPONENTS } from './components';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,

        LoadingModule,
        AssignPdfFieldModule,
        PdfFormReviewModule,
        PatientFormsRoutingModule,
    ],
    declarations: [
        PatientFormsComponent,
        ...COMPONENTS,
    ],
})
export class PatientFormsModule {
}
