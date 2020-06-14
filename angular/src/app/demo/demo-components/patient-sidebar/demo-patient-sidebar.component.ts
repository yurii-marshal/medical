import { Component, OnInit } from '@angular/core';
import { PatientService } from '@app/patients/modules/patient/services/patient.service';

@Component({
    selector: 'app-demo-patient-sidebar',
    templateUrl: './demo-patient-sidebar.component.html',
    styleUrls: ['./demo-patient-sidebar.component.scss'],
})
export class DemoPatientSidebarComponent implements OnInit {

    public isManageResupplyPage: boolean;

    // for real case, set id from router system (ActivatedRoute -> route.params)
    public patientId = '10000003';

    constructor(
        public patientService: PatientService,
    ) {
    }

    ngOnInit() {
        // this.route.params
        //     .pipe(
        //         takeUntil(this.destroy$),
        //         map((params) => params['patientId']),
        //         filter((patientId) => !!patientId),
        //     )
        //     .subscribe((patientId) => {
        //         this.patientId = patientId;
        //         this.patientService.setPatientId(patientId);
        //     });

        this.patientService.setPatientId(this.patientId);
    }

}
