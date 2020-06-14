import {
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatIconRegistry,
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { PatientEndpointsService } from '@shared/endpoints/core/patient/patient.endpoints';
import { DictionariesEndpointsService } from '@shared/endpoints/core/dictionaries/dictionaries.endpoints';
import {
    InactivityReason,
    PatientStatus,
} from '@shared/endpoints/core/patient/patient.interfaces';
import { Tag } from '@shared/endpoints/core/tags/tags.interface';
import * as moment from 'moment';
import { patientStatusConstants } from '@shared/consts/core.constants';
import { patientInactivityReasonConstants } from '@shared/consts/core.constants';

@Component({
    selector: 'app-edit-patient-attrs-modal',
    templateUrl: './edit-patient-attrs-modal.component.html',
    styleUrls: ['./edit-patient-attrs-modal.component.scss'],
})

export class EditPatientAttrsModalComponent implements OnInit {
    public editPatientForm: FormGroup;
    public statuses: PatientStatus[] = [];
    public patientTags: Tag[] = [];
    public inactivityReasons: InactivityReason[] = [];
    public patientDcDate: Date;
    public patientInactiveStatusText: string;
    public isSendingRequest: boolean;
    public displayClearButton = false;
    public tagsWidth = 343;
    public patientStatusConstants = patientStatusConstants;
    public patientInactivityReasonConstants = patientInactivityReasonConstants;

    constructor(
        public dialogRef: MatDialogRef<EditPatientAttrsModalComponent>,
        private patientEndpointsService: PatientEndpointsService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private dictionariesEndpointsService: DictionariesEndpointsService,
    ) {
        this.iconRegistry.addSvgIcon(
            'setup-rect',
            sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/default/setup-rect.svg'));

        this.editPatientForm = fb.group(
            {
                status: ['', [Validators.required]],
                reason: ['', [Validators.required]],
                date: [new Date(), [Validators.required]],
                inactivityReasonText: [''],
            },
        );
    }

    ngOnInit() {
        this.dictionariesEndpointsService.getPatientStatusesTypes()
            .subscribe((statuses: PatientStatus[]) => {
                this.statuses = statuses;
                this.editPatientForm.controls['status'].setValue(this.data.patient.Status.Id);
            });

        this.dictionariesEndpointsService.getPatientInactivityReasons()
            .subscribe((reasons: InactivityReason[]) => {
                this.inactivityReasons = reasons;
            });
        this.patientTags = this.data.tags.slice();
    }

    public onReasonChange() {
        if (this.editPatientForm.value.reason === patientInactivityReasonConstants.OTHER_ID) {
            this.editPatientForm.controls.inactivityReasonText.setValidators([Validators.required]);
        } else {
            this.editPatientForm.controls.inactivityReasonText.clearValidators();
            this.editPatientForm.controls.inactivityReasonText.reset();
        }
    }

    public send(): void {
        if (this.editPatientForm.valid || this.editPatientForm.value.status !== patientStatusConstants.INACTIVE_STATUS_ID) {
            const model = {
                PatientId: {Id: this.data.patient.Id},
                Status: this.editPatientForm.value.status,
                Tags: this.patientTags.map((tag: Tag) => tag.Id),
            };

            if (this.editPatientForm.value.status === patientStatusConstants.INACTIVE_STATUS_ID) {
                model['InactiveStatus'] = this.editPatientForm.value.reason;
                model['DcDate'] = this.editPatientForm.value.date
                    ? moment(this.editPatientForm.value.date).format('YYYY-MM-DD')
                    : null;

                if (+this.editPatientForm.value.reason === patientInactivityReasonConstants.OTHER_ID) {
                    model['InactiveStatusText'] = this.editPatientForm.value.inactivityReasonText;
                }
            }

            this.isSendingRequest = true;

            this.patientEndpointsService.savePatientState(this.data.patient.Id, model)
                .subscribe(() => {
                    this.isSendingRequest = false;
                    this.dialogRef.close({
                        sent: true,
                    });
                });
        }
    }

    public cancel(): void {
        this.dialogRef.close({
            sent: false,
        });
    }

}
