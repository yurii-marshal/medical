import { Component, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * 'No-Content' Component
 * Location:
 * -------------------
 * **NoContentModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/no-content</example-url>
 *
 * @example
 * <app-no-content></app-no-content>
 */
@Component({
    selector: 'app-no-content',
    templateUrl: './no-content.component.html',
    styleUrls: ['./no-content.component.scss'],
})

export class NoContentComponent {
    /** Input for a custom text which adds as a second line */
    @Input() text = '';
    @Input() hasDefaultText = true;
    /** Input for array of messages */
    @Input() messages: string[] = [];
    /** Add class for a records */
    @Input() type;
    public noContentText = `Sorry, there are no available records`;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        /**
         * @description - registration icons url for using in html attr
         */
        this.iconRegistry.addSvgIcon(
            'lens-icon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/lens.svg'));

    }

    @Input() set defaultLastWord(word) {
        this.noContentText = `Sorry, there are no available ${word}`;
    }

}
