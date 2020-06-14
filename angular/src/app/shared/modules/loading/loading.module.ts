import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLoadingComponent } from './loading.component';
import { LoadingConfigService } from './loading.service';


@NgModule({
    declarations: [
        AppLoadingComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        AppLoadingComponent,
    ],
    providers: [
        LoadingConfigService,
    ],
})

export class LoadingModule {
}
