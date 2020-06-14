import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { PdfFormReviewComponent } from './pdf-form-review.component';
import { PdfFormReviewService } from './services/pdf-form-review.service';

@NgModule({
    declarations: [
        PdfFormReviewComponent,
    ],
    imports: [
        SharedModule,
    ],
    providers: [
        PdfFormReviewService,
    ],
    exports: [
        PdfFormReviewComponent,
    ],
})

export class PdfFormReviewModule {
}
