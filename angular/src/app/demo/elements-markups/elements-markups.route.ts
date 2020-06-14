import {
    RouterModule,
    Routes,
} from '@angular/router';
import { NgModule } from '@angular/core';
import { PlusButtonComponent } from './plus-button/plus-button.component';
import { UiKitComponent } from '@app/demo/elements-markups/ui-kit/ui-kit.component';
import { NikoAccordionComponent } from './niko-accordion/niko-accordion.component';
import { StepperComponent } from './stepper/stepper.component';

const COMPONENTS = [
    { path: 'plus-button', component: PlusButtonComponent },
    { path: 'ui-kit', component: UiKitComponent },
    { path: 'niko-accordion', component: NikoAccordionComponent },
    { path: 'stepper', component: StepperComponent },
];

export const markupsRoutes: Routes = [
    {
        path: '',
        children: [...COMPONENTS],
    },
];

@NgModule({
    imports: [RouterModule.forChild(markupsRoutes)],
    exports: [RouterModule],
})

export class MarkupsRoutingModule {}
