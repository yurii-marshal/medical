import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import {
    Component,
    EventEmitter,
    OnInit,
    Output,
} from '@angular/core';
import { PatientService } from '@app/patients/modules/patient/services/patient.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

    /** Trigger an event whether sidebar is toggled */
    @Output() toggle = new EventEmitter();

    public sidebarClosed = false;

    public isHidden: boolean;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private patientService: PatientService,
    ) {
        this.iconRegistry.addSvgIcon(
            'chevron',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/chevron-v2.svg'));
    }

    ngOnInit() {
        this.patientService.hideSidebar$
            .subscribe((isHidden: boolean) => {
                this.isHidden = isHidden;
            });
    }

}
