import {
    Directive,
    DoCheck,
    EventEmitter,
    Host,
    OnDestroy,
    Optional,
    Output,
    Self,
    NgZone,
} from '@angular/core';

import { MatAutocomplete } from '@angular/material';
import { BehaviorSubject, Subscription } from 'rxjs';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
    distinctUntilChanged,
    filter,
} from 'rxjs/operators';

/**
 *
 * AutocompleteInfiniteScrollDirective is a infinite scroll directive for mat-autocomplete inputs only
 * with `scrollBottom` output event.
 *
 * Location:
 * -------------------
 * **AutocompleteInfiniteScrollDirective**
 * <example-url>http://niko.loc:8082/v2#/demo-components/zip-autocomplete</example-url>
 *
 * @example
 *
 * <mat-autocomplete appInfiniteScroll (scrollBottom)="getNextPage()">
 *     <mat-option *ngFor="let data of Data">
 *         {{ zipData.text }}
 *     </mat-option>
 * </mat-autocomplete>
 *
 */
@Directive({
    selector: '[appInfiniteScroll]',
})
export class AutocompleteInfiniteScrollDirective implements OnDestroy, DoCheck {

    private panelStatus$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private panelStatusSub: Subscription;
    private panelScrollEventSub: Subscription;
    private scrollBottomMargin = 20;

    /** Output event when scroll reached bottom */
    @Output() scrollBottom  = new EventEmitter<boolean>();

    constructor(
        @Host() @Self() @Optional() private matAutocomplete: MatAutocomplete,
        private zone: NgZone,
    ) {
        this.panelStatusSub = this.panelStatus$.subscribe((panelStatus: boolean) => {
            if (panelStatus) {
                this.initScrollEventListener();
            } else {
                this.destroyScrollEventListener();
            }
        });
    }

    private initScrollEventListener(): void {

        this.zone.runOutsideAngular(() => {
            this.panelScrollEventSub = fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
                .pipe(
                    distinctUntilChanged(),
                    filter(() => {
                        const nativeEl = this.matAutocomplete.panel.nativeElement;
                        return (nativeEl.scrollTop + nativeEl.clientHeight) >= nativeEl.scrollHeight - this.scrollBottomMargin;
                    }),
                )
                .subscribe(() => {
                    this.zone.run(() => {
                        this.scrollBottom.emit(true);
                    });
                });
        });
    }

    private destroyScrollEventListener(): void {
        if (this.panelScrollEventSub) {
            this.panelScrollEventSub.unsubscribe();
        }
    }

    ngDoCheck() {
        if (this.panelStatus$.getValue() !== this.matAutocomplete.isOpen) {
            setTimeout(() => {
                this.panelStatus$.next(this.matAutocomplete.isOpen);
            }, 0);
        }
    }

    ngOnDestroy() {
        if (this.panelStatusSub) {
            this.panelStatusSub.unsubscribe();
        }
    }
}
