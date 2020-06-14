import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VAccordionComponent } from './v-accordion.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],

    declarations: [
        VAccordionComponent,
    ],

    exports: [
        CommonModule,
        SharedModule,
        VAccordionComponent,
    ],
})
export class VAccordionModule {
}
