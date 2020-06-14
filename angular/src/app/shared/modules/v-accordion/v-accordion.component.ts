import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * 'Mapping-Autocomplete' Component
 * Location:
 * -----------------
 * **ExpansionPanelModule**
 * <example-url>http://niko.loc:8082/v2/#/demo-components/v-accordion</example-url>
 *
 * @example
 * <app-v-accordion
 *      [header]="header"
 *      [expanded]="true"
 * ></app-v-accordion>
 */

@Component({
    selector: 'app-v-accordion',
    templateUrl: './v-accordion.component.html',
    styleUrls: ['./v-accordion.component.scss'],
})
export class VAccordionComponent implements OnInit {

    /** Get a name of header */
    @Input() header = '';
    /** Set accordion expanding state */
    @Input() expanded = true;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        this.iconRegistry.addSvgIcon(
            'chevron',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/chevron.svg'));
        this.iconRegistry.addSvgIcon(
            'home_phone',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/phone-home.svg'));
        this.iconRegistry.addSvgIcon(
            'insurance',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/insurance-circle.svg'));
        this.iconRegistry.addSvgIcon(
            'orders',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/phone-cell.svg'));
        this.iconRegistry.addSvgIcon(
            'lens',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/lens.svg'));
        this.iconRegistry.addSvgIcon(
            'calendar',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/main-menu/calendar.svg'));
    }

    ngOnInit() {
    }

}
