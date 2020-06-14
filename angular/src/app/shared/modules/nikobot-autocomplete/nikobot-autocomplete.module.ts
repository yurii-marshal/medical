import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { NikobotAutocompleteComponent } from './nikobot-autocomplete.component';
import { NikobotAutocompleteService } from './nikobot-autocomplete.service';

@NgModule({
    declarations: [
        NikobotAutocompleteComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        NikobotAutocompleteComponent,
    ],
    providers: [
        NikobotAutocompleteService,
    ],
})

export class NikobotAutocompleteModule {}
