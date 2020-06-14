import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs/observable/fromEvent';

// It need for possibility add new contact from external element
@Directive({
    selector: '[appAddNewContact]',
})
export class AddNewContactDirective implements OnDestroy {

    public subscriptionClick: Subscription;

    // This type should be ComponentRef<PatientContactsComponent> but Angular can't see onAddContact method
    @Input('appAddNewContact') contactsComponent: any;

    constructor(el: ElementRef) {
        this.subscriptionClick = fromEvent(el.nativeElement, 'click').subscribe(() => {
            this.contactsComponent.onAddContact();
        });
    }

    ngOnDestroy() {
        if (this.subscriptionClick) {
            this.subscriptionClick.unsubscribe();
        }
    }
}
