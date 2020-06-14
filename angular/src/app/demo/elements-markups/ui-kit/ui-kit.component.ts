import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

/**
 * Additional information for buttons is [here](https://material.angular.io/components/button/overview).
 *
 * Additional information for form fields is [here](https://material.angular.io/components/form-field/overview).
 *
 * More icons are [here](https://www.angularjswiki.com/angular/angular-material-icons-list-mat-icon-list/).
 *
 * <example-url>http://niko.loc:8082/v2#/markups/ui-kit</example-url>
 */
@Component({
    selector: 'app-ui-kit',
    templateUrl: './ui-kit.component.html',
    styleUrls: ['./ui-kit.component.scss'],
})
export class UiKitComponent {

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        this.iconRegistry.addSvgIcon(
            'calendar-circle',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/calendar-circle-v2.svg'));
        this.iconRegistry.addSvgIcon(
            'track-in-progress',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/track-in-progress.svg'));
        this.iconRegistry.addSvgIcon(
            'clock-filled',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/clock-filled.svg'));
        this.iconRegistry.addSvgIcon(
            'dollar-circle',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/dollar-circle.svg'));
        this.iconRegistry.addSvgIcon(
            'document',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/document.svg'));
        this.iconRegistry.addSvgIcon(
            'user_v2',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/user_v2.svg'));
    }
}
