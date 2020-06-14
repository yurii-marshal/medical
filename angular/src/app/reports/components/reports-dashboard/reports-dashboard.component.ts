import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { appConfig } from '../../../../app-config/app-config';

@Component({
    selector: 'app-reports-dashboard',
    templateUrl: './reports-dashboard.html',
    styleUrls: ['./reports-dashboard.scss'],
})
export class ReportsDashboardComponent implements OnInit {

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        /**
         * @description - registration icons url for using in html attr
         */
        this.iconRegistry.addSvgIcon(
            'chevron',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/chevron-v2.svg'));

        this.iconRegistry.addSvgIcon(
            'edit',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/edit.svg'));
    }

    ngOnInit() {}

    public goToV1Reports(urlParams: string): void {
         // urlParams
        // for filters = filterId:operationId:filterValue,...
        // reportSourceId

        window.location.href = appConfig.app_v1_domain + '#/reports?' + urlParams;
    }
}
