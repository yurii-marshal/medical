import {
    Directive,
    ElementRef,
    OnDestroy,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs/observable/fromEvent';

/*
    Navigation tab will hightlined after click on menu item or after we catch iframe event.
    As iframe not guarantee order for events we can get bug with focus after click. We will have two tab hightlined one time.
    This directive need for fix this issue.
 */

@Directive({
    selector: '[appBlurAfterClick]',
})
export class BlurAfterClickDirective implements OnDestroy {

    clickSubscription: Subscription;

    constructor(private el: ElementRef) {
        this.clickSubscription = fromEvent(el.nativeElement, 'click').subscribe(() => {
            setTimeout(() => {
                this.el.nativeElement.blur();
            }, 1000);
        });
    }

    ngOnDestroy() {
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
        }
    }
}
