import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';

/**
 * <example-url>http://niko.loc:8082/v2#/markups/niko-accordion</example-url>
 */
@Component({
    selector: 'app-niko-accordion',
    templateUrl: './niko-accordion.component.html',
    styleUrls: ['./niko-accordion.component.scss'],
})
export class NikoAccordionComponent implements OnInit {

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        this.iconRegistry.addSvgIcon(
            'chevron',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/chevron.svg'));

    }

    ngOnInit() {
    }
}
