import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListToPopoverComponent } from './list-to-popover.component';
import { SharedModule } from '../../shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],
    declarations: [ListToPopoverComponent],
    exports: [ListToPopoverComponent],
})
export class ListToPopoverModule {
}
