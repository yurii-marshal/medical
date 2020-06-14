import {
    Injectable,
    OnDestroy,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PdfFormReviewService implements OnDestroy {
    public pageSource$ = new BehaviorSubject(null);
    public clearSource$ = new BehaviorSubject(false);

    constructor() {
    }

    ngOnDestroy() {
        this.pageSource$.unsubscribe();
        this.clearSource$.unsubscribe();
    }

    public setHighlightRectangle(fieldName: string) {
        this.pageSource$.next(fieldName);
    }

    public clearHighlights() {
        this.clearSource$.next(true);
    }

}
