import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { StateAutocompleteComponent } from './state-autocomplete.component';

const COMPONENTS = [
    StateAutocompleteComponent,
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
