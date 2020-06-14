import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ZipAutocompleteComponent } from './zip-autocomplete.component';
import { AutocompleteInfiniteScrollDirective } from '../../directives/autocomplete-infinite-scroll.directive';

const COMPONENTS = [
    ZipAutocompleteComponent,
    AutocompleteInfiniteScrollDirective,
];

const MODULES = [
    SharedModule,
];

@NgModule({
    imports: [...MODULES],
    declarations: [...COMPONENTS],
    exports: [...MODULES, ...COMPONENTS],
})

export class ZipAutocompleteModule {
}
