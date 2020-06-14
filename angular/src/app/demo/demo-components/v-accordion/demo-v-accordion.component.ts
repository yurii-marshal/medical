import { Component, OnInit } from '@angular/core';
import { PatientService } from '@app/patients/modules/patient/services/patient.service';
import {
    PatientShortInfo,
} from '@app/patients/modules/patient/modules/patient-short-info-sidebar/models/patient-short-info-sidebar.interfaces';
import { DictionariesEndpointsService } from '@shared/endpoints/core/dictionaries/dictionaries.endpoints';

@Component({
    selector: 'app-demo-v-accordion',
    templateUrl: './demo-v-accordion.component.html',
    styleUrls: ['./demo-v-accordion.component.scss'],
})
export class DemoVAccordionComponent implements OnInit {
    public homePhone = '';
    public insurance = [];
    public orders = [];
    public recentAppointments = [];
    public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public currentPatient: PatientShortInfo;
    private patientId = '10000013';

    constructor(
        private patientService: PatientService,
        private dictionariesEndpointsService: DictionariesEndpointsService,
    ) {
    }

    ngOnInit() {
        this.patientService.setPatientId(this.patientId);

        this.patientService.shortInfo$.subscribe(({ patient }) => {
            this.currentPatient = patient;

            if (patient.HomePhone) {
                this.homePhone = patient.HomePhone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
            }

            if (patient.Insurances) {
                this.insurance = patient.Insurances;
            }

            this.recentAppointments = patient.RecentAppointments;
        });

        this.dictionariesEndpointsService.getPatientOrderTypes(this.patientId)
            .subscribe((data: any) => {
                this.orders = data.Items;
            });

    }

}
