import {
    OnInit,
    OnDestroy,
    Input,
    ElementRef,
    Output,
    EventEmitter,
    NgZone,
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Directive } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs';

interface Viewport {
    w: number;
    h: number;
}

/**
 *
 * InfiniteScroll directive fire `scrollEnd` event when element reach bottom of the
 * block.
 *
 * Location:
 * -------------------
 * **InfiniteScrollDirective**
 * <example-url>http://niko.loc:8082/v2#/demo-components/infinite-scroll</example-url>
 *
 * @example
 * <div class="scroll" appNikoInfiniteScroll (scrollEnd)="scrollEnd()"></div>
 * <div class="scroll" appNikoInfiniteScroll (scrollEnd)="scrollEnd()" [isScrollSelf]="true"></div>
 * <div class="scroll" appNikoInfiniteScroll (scrollEnd)="scrollEnd()" [isLoading]='isLoading'></div>
 *
 */
@Directive({
    selector: '[appNikoInfiniteScroll]',
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
    /** Property for determine is data loading. If `true` denied scrollEnd event */
    @Input() isLoading = false;
    /** Mode for block with overflow: scroll  */
    @Input() isScrollSelf = false;
    /** Output event when connent of the element reach bottom of the parent block */
    @Output() scrollEnd: EventEmitter<boolean> = new EventEmitter();

    public viewport: Viewport;
    public elementScrollSubscription: Subscription;

    constructor(
        private el: ElementRef,
        private zone: NgZone,
    ) { }

    ngOnInit() {
        this.getViewport();

        if (this.isScrollSelf) {
            const scrollableElement = this.el.nativeElement;

            if (scrollableElement) {
                this.elementScrollEvent(scrollableElement);
            }
        } else {
            this.elementScrollEvent(window);
        }
    }

    elementScrollEvent(scrollableElement): void {
        this.zone.runOutsideAngular(() => {
            this.elementScrollSubscription = fromEvent(scrollableElement, 'scroll').pipe(
                debounceTime(700),
            ).subscribe(() => {
                if (this.elementEndOfContext() && !this.isLoading) {
                    this.zone.run(() => {
                        this.scrollEnd.emit(true);
                    });
                }
            });
        });
    }

    getViewport(): void {
        if (window.innerWidth != null) {
            this.viewport = { w: window.innerWidth, h: window.innerHeight };
        } else {
            const d = window.document;

            if (document.compatMode === 'CSS1Compat') {
                this.viewport = { w: d.documentElement.clientWidth, h: d.documentElement.clientHeight };
            } else {
                this.viewport = { w: d.body.clientWidth, h: d.body.clientHeight };
            }
        }
    }

    elementEndOfContext(): boolean {
        if (!this.isScrollSelf) {
            const rect = this.el.nativeElement.getBoundingClientRect();
            const elementTopRelativeToViewport = rect.top;
            const elementTopRelativeToDocument = elementTopRelativeToViewport + window.pageYOffset;
            const scrollableDistance = this.el.nativeElement.offsetHeight + elementTopRelativeToDocument;
            const currentPos = window.pageYOffset + this.viewport.h;

            if (currentPos > scrollableDistance) {
                return true;
            }
        } else {
            const scrollableElement = this.el.nativeElement;

            if (scrollableElement.offsetHeight + scrollableElement.scrollTop === scrollableElement.scrollHeight) {
                return true;
            }
        }

        return false;
    }

    ngOnDestroy() {
        if (this.elementScrollSubscription) {
            this.elementScrollSubscription.unsubscribe();
        }
    }
}

