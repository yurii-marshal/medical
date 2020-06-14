import { NgModule } from '@angular/core';
import { SidebarComponent } from '@app/core/sidebar/sidebar.component';
import { SharedModule } from '@shared/shared.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
    declarations: [
        SidebarComponent,
    ],
    imports: [
        SharedModule,
        PerfectScrollbarModule,
    ],
    exports: [
        SharedModule,
        SidebarComponent,
    ],
    providers: [
    ],
    entryComponents: [
    ],
})

export class SidebarModule {
}
