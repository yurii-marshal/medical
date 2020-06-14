import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClientFormValue } from '@shared/endpoints/core/dictionaries/client-form-values.interface';
import { DictionariesEndpointsService } from '@shared/endpoints/core/dictionaries/dictionaries.endpoints';

@Injectable()
export class AssignPdfFieldService {
    public pdfDictionary$: BehaviorSubject<ClientFormValue[]> = new BehaviorSubject<ClientFormValue[]>([]);

    constructor(private dictionariesEndpointsService: DictionariesEndpointsService) {
        this.dictionariesEndpointsService.getMappingDictionary()
            .subscribe((results) => {
                this.pdfDictionary$.next(results);
            });
    }
}
