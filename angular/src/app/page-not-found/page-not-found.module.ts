import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found.component';
import { RouterModule } from '@angular/router';
import { pageNotFoundRoutes } from './page-not-found.route';
import { LoadingModule } from '@shared/modules/loading/loading.module';

@NgModule({
    declarations: [
        PageNotFoundComponent,
    ],
    imports: [
        RouterModule.forChild(
            pageNotFoundRoutes,
        ),
        LoadingModule,
    ],
    providers: [],
})

export class PageNotFoundModule {
}
