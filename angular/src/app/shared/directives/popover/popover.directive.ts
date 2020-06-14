import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
} from '@angular/core';
import tippy from 'tippy.js';
import { PopoverOptions } from './popover.interface';
import {
    PopoverArrowType,
    PopoverPlacement,
} from './popover.enum';

/**
 *
 * AppPopoverDirective add popover functionality to element.
 * Works in pair with ListToPopoverComponent.
 *
 * Location:
 * -------------------
 * **AppPopoverDirective**
 * <example-url>http://niko.loc:8082/v2#/demo-components/popover</example-url>
 *
 * @example
 *
 * <div class="popover" appPopover [popoverOptions]="popoverOptions">
 *   <p>phone data</p>
 * </div>
 *
 */
@Directive({
    selector: '[appPopover]',
})
export class AppPopoverDirective implements OnDestroy {
    /** popoverOptions object with `itemsArray` of popover data */
    @Input() set popoverOptions(options: PopoverOptions) {
        this._popoverOptions = options;
        this.initPopover();
    }

    public _popoverOptions: PopoverOptions = {};
    public tippyInstance: any;
    public defaultOptions: PopoverOptions;
    public popoverArrowType = PopoverArrowType;
    public popoverPlacement = PopoverPlacement;

    constructor(private element: ElementRef) {
        this.defaultOptions = {
            arrow: true,
            duration: 0,
            createPopperInstanceOnInit: true,
            arrowType: this.popoverArrowType.SHARP,
            placement: this.popoverPlacement.RIGHT,
            distance: 15,
        };
    }

    public initPopover(): void {
        this._popoverOptions = Object.assign({}, this._popoverOptions, this.defaultOptions);

        if (this.tippyInstance) {
            this.tippyInstance.destroy();
        }

        if (!this._popoverOptions.html && this._popoverOptions.itemsArray) {
            this._popoverOptions.html = this._popoverOptions.itemsArray.reduce((rootElement, message) => {
                const element = document.createElement('div');

                element.innerHTML = message;
                rootElement.appendChild(element);
                return rootElement;
            }, document.createElement('div'));
        }

        this._popoverOptions.wait = (show: () => void): void => {
            const viewport = { w: window.innerWidth, h: window.innerHeight };
            const rect = this.element.nativeElement.getBoundingClientRect();
            const elementTopRelativeToViewport = rect.top;
            const elementTopRelativeToDocument = elementTopRelativeToViewport + window.pageYOffset;
            const scrollableDistance = this.element.nativeElement.offsetHeight + elementTopRelativeToDocument;
            const currentPos = window.pageYOffset + viewport.h;

            if (currentPos > scrollableDistance + this.element.nativeElement.offsetHeight) {
                this.updatePopoverPosition('right');
                show();
            } else {
                this.updatePopoverPosition('top');
                show();
            }
        };

        this._popoverOptions.theme = this._popoverOptions.class || '';
        this.tippyInstance = tippy.one(this.element.nativeElement, this._popoverOptions);
    }

    public updatePopoverPosition(position: string): void {
        const { popperInstance, options } = this.tippyInstance;

        options.placement = popperInstance.options.placement = position;
        popperInstance.update();
    }

    ngOnDestroy() {
        if (this.tippyInstance) {
            this.tippyInstance.destroy();
        }
    }
}
