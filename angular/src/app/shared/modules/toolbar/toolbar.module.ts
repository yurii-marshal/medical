import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
    declarations: [
        ToolbarComponent,
    ],
    imports: [
        SharedModule,
    ],
    providers: [],
    exports: [
        ToolbarComponent,
    ],
})

export class  ToolbarModule {
}
