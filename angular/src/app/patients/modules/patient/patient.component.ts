import {
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import {
    filter,
    map,
    takeUntil,
} from 'rxjs/operators';

import { SubTab } from '@shared/modules/sub-tabs/sub-tab.interface';
import { PatientService } from './services/patient.service';

@Component({
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.scss'],
})
export class PatientComponent implements OnInit, OnDestroy {

    public tabs: SubTab[] = [
        {
            url: 'demographics',
            text: 'Demographics',
        },
        {
            url: 'medical-records',
            text: 'Medical Records',
        },
        {
            url: 'insurances',
            text: 'Insurance',
        },
        {
            url: 'documents',
            text: 'Documents',
        },
        {
            url: 'forms',
            text: 'Forms',
        },
        {
            url: 'prescription',
            text: 'Prescription',
        },
        {
            url: 'therapy',
            text: 'Therapy Data',
        },
        {
            url: 'items',
            text: 'Items',
        },
        {
            url: 'orders',
            text: 'Orders',
        },
        {
            text: 'Notes',
            url: 'notes',
        },
        {
            text: 'Financial',
            url: 'financial',
        },
        {
            url: 'resupply',
            text: 'Resupply',
        },
    ];
    public patientId: string;

    private destroy$: Subject<void> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private patientService: PatientService,
    ) {
    }

    ngOnInit(): void {
        this.route.params
            .pipe(
                takeUntil(this.destroy$),
                map((params) => params['patientId']),
                filter((patientId) => !!patientId),
            )
            .subscribe((patientId) => {
                this.patientId = patientId;
                this.patientService.setPatientId(patientId);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.patientService.destroy();
    }

    onTabClick(tab: SubTab): void {
        this.router.navigate([ '/patient', this.patientId, tab.url ]);
    }

}
