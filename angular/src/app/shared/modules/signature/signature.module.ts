import { CanvasResizeService } from './services/canvas-resize.service';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SignatureComponent } from '@shared/modules/signature/signature.component';

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        SignatureComponent,
    ],
    exports: [
        SignatureComponent,
    ],
    providers: [
        CanvasResizeService,
    ],
})
export class SignatureModule { }
