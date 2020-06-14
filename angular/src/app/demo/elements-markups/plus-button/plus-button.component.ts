import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * <example-url>http://niko.loc:8082/v2#/markups/plus-button</example-url>
 */
@Component({
    selector: 'app-plus-button',
    templateUrl: './plus-button.component.html',
    styleUrls: ['./plus-button.component.scss'],
})
export class PlusButtonComponent implements OnInit {
    public isMenuOpen = false;

    constructor(
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit() {
        this.matIconRegistry.addSvgIcon('plusIcon', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/plus.svg'));
    }

    public switchMenuStatus() {
        this.isMenuOpen = !this.isMenuOpen;
    }

}
