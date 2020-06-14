import { NgModule } from '@angular/core';
import { EmailInputComponent } from './email-input.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

const COMPONENTS = [
    EmailInputComponent,
];

const MODULES = [
    CommonModule,
    SharedModule,
];

@NgModule({
    imports: [...MODULES],
    declarations: [...COMPONENTS],
    exports: [...MODULES, ...COMPONENTS],
})

export class EmailInputModule {
}
