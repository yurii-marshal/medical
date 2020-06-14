import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { AttrsTagsComponent } from './attrs-tags.component';
import { NoContentModule } from '../no-content/no-content.module';

@NgModule({
    declarations: [
        AttrsTagsComponent,
    ],
    imports: [
        SharedModule,
        NoContentModule,
    ],
    providers: [],
    exports: [
        AttrsTagsComponent,
    ],
})

export class AttrsTagsModule {
}
