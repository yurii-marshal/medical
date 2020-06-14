import { NgModule } from '@angular/core';
import { PhoneInputComponent } from './phone-input.component';
import { PhoneNumberValidatorDirective } from './phone-validator.directive';
import { NgxMaskModule } from 'ngx-mask';

import { SharedModule } from '../../shared.module';

@NgModule({
    declarations: [
        PhoneInputComponent,
        PhoneNumberValidatorDirective,
    ],
    imports: [
        SharedModule,
        NgxMaskModule.forRoot(),
    ],
    providers: [],
    exports: [
        PhoneInputComponent,
        PhoneNumberValidatorDirective,
        NgxMaskModule,
    ],
})

export class  PatientNumberInputModule {
}
