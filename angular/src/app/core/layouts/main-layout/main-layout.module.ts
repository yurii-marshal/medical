import { NgModule } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';
import { NavigationModule } from '../../navigation/navigation.module';
import { RefreshTokenModule } from '@app/auth/directives/refresh-token/refresh-token.module';

@NgModule({
    declarations: [ MainLayoutComponent ],
    imports: [
        RouterModule,
        NavigationModule,
        RefreshTokenModule,
    ],
    providers: [],
    exports: [
        NavigationModule,
    ],
})
export class  MainLayoutModule {
}
