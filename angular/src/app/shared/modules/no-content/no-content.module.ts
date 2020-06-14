import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { NoContentComponent } from './no-content.component';

@NgModule({
    declarations: [
        NoContentComponent,
    ],
    imports: [
        SharedModule,
    ],
    providers: [],
    exports: [
        NoContentComponent,
    ],
})

export class NoContentModule {
}
