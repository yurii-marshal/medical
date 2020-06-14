import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatStepperModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatMenuModule,
} from '@angular/material';

import { MomentModule } from 'angular2-moment';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Pipes
import { PhonePipe } from './pipes/phone.pipe';
import { MarkdownToHtmlPipe } from './pipes/markdown-to-html.pipe';

import { AppPopoverDirective } from './directives/popover/popover.directive';
import { ClearOnClickDirective } from './directives/clear-on-click.directive';
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ErrorMessagesDirective } from '@shared/directives/error-messages/error-messages.directive';

import { UserPictureService } from '@shared/services/user-picture.service';
import { AddressToStringPipe } from '@shared/pipes/address-to-string.pipe';
import { GetCssClassPipe } from '@shared/pipes/get-css-class.pipe';

const COMPONENTS = [
    PhonePipe,
    AddressToStringPipe,
    MarkdownToHtmlPipe,
    GetCssClassPipe,
    AppPopoverDirective,
    ClickOutsideDirective,
    ClearOnClickDirective,
    ErrorMessagesDirective,
    InfiniteScrollDirective,
];

const MODULES = [
    PerfectScrollbarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MomentModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatStepperModule,
    MatExpansionModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatMenuModule,
];

const PROVIDERS = [
    PhonePipe,
    MarkdownToHtmlPipe,
    AddressToStringPipe,
    GetCssClassPipe,
    UserPictureService,
];

@NgModule({
    imports: [...MODULES],
    declarations: [...COMPONENTS],
    exports: [...MODULES, ...COMPONENTS],
    providers: [...PROVIDERS],
})

export class SharedModule {}
