import { Component, OnInit } from '@angular/core';
import { PatientEndpointsService } from '@app/shared/endpoints/core/patient/patient.endpoints';
import { Patient, PatientsState } from '@shared/endpoints/core/patient/patient.interfaces';

@Component({
    selector: 'app-infinite-scroll',
    templateUrl: './demo-infinite-scroll.component.html',
    styleUrls: ['./demo-infinite-scroll.component.scss'],
})
export class DemoInfiniteScrollComponent implements OnInit {

    public scrollData: Patient[];

    constructor(
        private patientService: PatientEndpointsService,
    ) {
    }

    ngOnInit() {
        this.patientService.getPatients().subscribe((data: PatientsState) => {
            const patients = data.patients;
            this.scrollData = patients.allIds.map((patientId) => patients.byId[patientId]);
        });
    }

    public onScrollEnd() {
        alert('SCROLL END');
    }
}
