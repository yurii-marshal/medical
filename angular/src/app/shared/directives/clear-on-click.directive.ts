import {
    Directive,
    ElementRef,
    OnDestroy,
    Input,
    OnInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs';

/**
 *
 * ClearOnClickDirective add clear button for input when it contains data.
 * Element with this directive must be part of a form.
 *
 * Location:
 * -------------------
 * **ClearOnClickDirective**
 * <example-url>http://niko.loc:8082/v2#/demo-components/clear-on-click</example-url>
 *
 * @example
 *
 * <form [formGroup]="form">
 *     <mat-form-field>
 *         <input matInput
 *                placeholder="Placeholder"
 *                aria-label="Placeholder"
 *                formControlName="name"
 *                appClearOnClick
 *          >
 *     </mat-form-field>
 * </form>
 *
 */
@Directive({
    selector: '[appClearOnClick]',
})

export class ClearOnClickDirective implements OnInit, OnDestroy {
    @Input()
    get appClearOnClick(): boolean {
        return this._appClearOnClick;
    }
    set appClearOnClick(val: boolean) {
        if (this._appClearOnClick !== val) {
            this._appClearOnClick = val;
        }
    }

    private _appClearOnClick = true;
    private clearBtnEl: Element;
    public eventSubscription: Subscription;
    public formControlSubscription: Subscription;

    constructor(
        private el: ElementRef,
        private control: NgControl,
    ) {}

    ngOnInit() {
        if (this.control.value) {
            this.addClearBtn();
        }

        this.control.valueChanges.subscribe((val) => {
            if (!val && this.clearBtnEl) {
                this.removeClearBtn();
            }

            if (val && !this.clearBtnEl) {
                this.addClearBtn();
            }
        });
    }

    ngOnDestroy() {
        this.removeClearBtn();

        if (this.formControlSubscription) {
            this.formControlSubscription.unsubscribe();
        }
    }

    public addClearBtn(): void {
        if (this._appClearOnClick) {
            if (this.clearBtnEl) {
                this.removeClearBtn();
            }

            this.clearBtnEl = document.createElement('span');

            this.clearBtnEl.className = 'clear-field';

            this.el.nativeElement.parentElement.appendChild(this.clearBtnEl, this.el.nativeElement);

            this.eventSubscription = fromEvent(this.clearBtnEl, 'click').subscribe((event: Event) => {
                event.stopPropagation();
                this.control.control.setValue('');
                this.removeClearBtn();
            });
        }
    }

    public removeClearBtn(): void {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }

        if (this.clearBtnEl) {
            this.clearBtnEl.remove();
            this.clearBtnEl = null;
        }
    }
}
