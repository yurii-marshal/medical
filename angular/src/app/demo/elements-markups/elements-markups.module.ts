// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkupsRoutingModule } from './elements-markups.route';
import { SharedModule } from '@shared/shared.module';
import { PlusButtonComponent } from './plus-button/plus-button.component';
import { UiKitComponent } from '@app/demo/elements-markups/ui-kit/ui-kit.component';
import { NikoAccordionComponent } from './niko-accordion/niko-accordion.component';
import { StepperComponent } from './stepper/stepper.component';

const COMPOENTS = [
    PlusButtonComponent,
    UiKitComponent,
    NikoAccordionComponent,
    StepperComponent,
];

const MODULES = [
    CommonModule,
    MarkupsRoutingModule,
    SharedModule,
];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPOENTS],
  exports: [...MODULES, ...COMPOENTS],
})
export class ElementsMarkupsModule { }
