import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';
import {
    filter,
    finalize,
    tap,
} from 'rxjs/operators';
import { PatientEndpointsService } from '@shared/endpoints/core/patient/patient.endpoints';
import { TagsEndpointsService } from '@shared/endpoints/core/tags/tags.endpoints';
import { ShortInfo } from '../modules/patient-short-info-sidebar/models/patient-short-info-sidebar.interfaces';

@Injectable()
export class PatientService {

    public shortInfo$: Observable<ShortInfo>;
    public loading$: Observable<boolean>;

    public hideSidebar$ = new BehaviorSubject<boolean>(false);

    private _patientId$ = new BehaviorSubject<string>(null);
    private _shortInfo$ = new BehaviorSubject<ShortInfo>(null);
    private _loading$ = new BehaviorSubject<boolean>(false);

    constructor(
        private patientEndpointsService: PatientEndpointsService,
        private tagsEndpointsService: TagsEndpointsService,
    ) {
        this.initStreams();
    }

    public init(): void {
    }

    public destroy(): void {
        this._patientId$.next(null);
        this._shortInfo$.next(null);
    }

    public setPatientId(patientId: string): void {
        this._patientId$.next(patientId);
    }

    public refreshShortInfo(): void {
        this.getShortInfo();
    }

    public hideSidebar(isHidden: boolean) {
        this.hideSidebar$.next(isHidden);
    }

    private initStreams(): void {
        this.loading$ = this._loading$.asObservable();
        this.shortInfo$ = this._shortInfo$.pipe(filter((v) => !!v));

        this._patientId$
            .pipe(filter((v) => !!v))
            .subscribe(() => this.getShortInfo());
    }

    private getShortInfo(): void {
        const patientId = this._patientId$.getValue();

        if (!patientId) {
            return;
        }

        forkJoin([
            this.patientEndpointsService.getShortInfo(patientId),
            this.tagsEndpointsService.getPatientTags(patientId),
        ]).pipe(
            tap(() => this._loading$.next(true)),
            finalize(() => this._loading$.next(false)),
        ).subscribe(([patient, tags]) => {
            this._shortInfo$.next({patient, tags});
        });
    }

}
