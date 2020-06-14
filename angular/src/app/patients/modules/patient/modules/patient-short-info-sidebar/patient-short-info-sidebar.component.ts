import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { PatientShortInfo } from './models/patient-short-info-sidebar.interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import {
    MatDialog,
    MatIconRegistry,
} from '@angular/material';
import {
    EditPatientAttrsModalComponent,
} from './modals/edit-patient-attrs-modal/edit-patient-attrs-modal.component';
import { Tag } from '@shared/endpoints/core/tags/tags.interface';
import { PatientService } from '../../services/patient.service';
import { takeWhile } from 'rxjs/operators';
import { PhonePipe } from '@app/shared/pipes/phone.pipe';
import {
    insurancePriorityNames,
    userGender,
} from '@app/shared/consts/core.constants';

/**
 * 'Patient Short Info Sidebar' Component
 * Show sidebar with information about a patient
 *
 * Location:
 * -------------------
 * **PatientSidebarModule**
 * <example-url>http://niko.loc:8082/v2/#/demo-components/patient-sidebar</example-url>
 *
 * @example
 * <app-patient-short-info-sidebar
 *      [patientId]="currentPatientId"
 * >
 * </app-patient-short-info-sidebar>
 *
 */
@Component({
    selector: 'app-patient-short-info-sidebar',
    templateUrl: './patient-short-info-sidebar.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./patient-short-info-sidebar.scss'],
})

export class PatientShortInfoSidebarComponent implements OnInit, OnDestroy {

    /** Get patient ID */
    @Input() patientId: number;

    public homePhone = '';

    public patient: PatientShortInfo;
    public tags: Tag[];

    public insurancePriority = insurancePriorityNames;
    public userGender = userGender;

    private aliveSubscriptions = true;

    constructor(
        private patientService: PatientService,
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private dialog: MatDialog,
        private phonePipe: PhonePipe,
    ) {
        this.matIconRegistry.addSvgIcon(
            'ic-pg-medsage',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/default/ic-pg-medsage.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'calendar-circle-v2',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/default/calendar-circle-v2.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'address',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/default/address.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'mail',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/default/mail.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'male',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/colored/male.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'female',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/colored/female.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'edit',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/default/edit.svg'),
        );
        this.matIconRegistry.addSvgIcon(
            'tagIcon',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/default/tag.svg'));
    }

    ngOnInit() {
        this.patientService.shortInfo$
            .pipe(
                takeWhile(() => this.aliveSubscriptions),
            )
            .subscribe(({ patient, tags }) => {
                this.patient = patient;
                this.tags = tags;
                this.homePhone = this.phonePipe.transform(this.patient.HomePhone.trim());
            });
    }

    ngOnDestroy() {
        this.aliveSubscriptions = false;
    }

    openEditDialog() {
        const dialog = this.dialog.open(EditPatientAttrsModalComponent, {
            data: {
                patient: this.patient,
                tags: this.tags,
            },
            disableClose: true,
        });

        dialog.afterClosed().subscribe((result) => {
            if (result) {
                this.patientService.refreshShortInfo();
            }
        });
    }

}
