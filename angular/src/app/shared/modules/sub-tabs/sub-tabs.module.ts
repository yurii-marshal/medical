import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubTabsComponent } from './sub-tabs.component';

@NgModule({
    declarations: [
        SubTabsComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        SubTabsComponent,
    ],
})

export class SubTabsModule {
}
