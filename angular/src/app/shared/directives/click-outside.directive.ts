import {
    Directive,
    ElementRef,
    Output,
    EventEmitter,
    AfterViewInit,
    OnDestroy,
    NgZone,
} from '@angular/core';

// RxJs
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs/observable/fromEvent';

/**
 *
 * ClickOutsideDirective fire `clickOutside` event when block clicked outsed of his borders
 *
 * Location:
 * -------------------
 * **ClickOutsideDirective**
 * <example-url>http://niko.loc:8082/v2#/demo-components/click-outside</example-url>
 *
 * @example
 *
 * <div class="block" clickOutside (clickOutside)="clickOutside()"></div>
 *
 */
@Directive({
    selector: '[appClickOutside]',
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
    /** Output event fires when block clicked outsed of his borders */
    @Output() clickOutside = new EventEmitter();

    public documentListener: Subscription;

    constructor(
        private zone: NgZone,
        private _elementRef: ElementRef,
    ) {
    }

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            this.documentListener = fromEvent(document, 'click')
                .subscribe((res) => {
                    const clickedInside = this._elementRef.nativeElement.contains(res['target']);
                    if (!clickedInside) {
                        this.zone.run(() => {
                            this.clickOutside.emit(null);
                        });
                    }
                });
        });
    }

    ngOnDestroy() {
        this.documentListener.unsubscribe();
    }
}
