import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { SpellTextInputComponent } from '@shared/modules/spell-text-input/spell-text-input.component';

const COMPONENTS = [
    SpellTextInputComponent,
];

const MODULES = [
    SharedModule,
];

@NgModule({
    imports: [...MODULES],
    declarations: [...COMPONENTS],
    exports: [...MODULES, ...COMPONENTS],
})

export class  StateAutocompleteModule {
}
