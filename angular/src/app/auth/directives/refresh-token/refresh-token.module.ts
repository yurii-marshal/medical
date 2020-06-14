import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { RefreshTokenDirective } from '@app/auth/directives/refresh-token/refresh-token.directive';

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [RefreshTokenDirective],
    exports: [RefreshTokenDirective],
    providers: [],
})
export class RefreshTokenModule {}
