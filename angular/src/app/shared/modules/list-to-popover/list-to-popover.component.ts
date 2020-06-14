import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { PopoverOptions } from '../../directives/popover/popover.interface';

/**
 *
 * ListToPopover is a custom module build with tippy.js 2.6.0v for transforming
 * list of data into popover.
 *
 * Location:
 * -------------------
 * **ListToPopoverModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/list-to-popover</example-url>
 *
 * @example
 * <app-list-to-popover [popoverItems]="popoverData"></app-list-to-popover>
 * <app-list-to-popover [popoverItems]="popoverData" [showOnlyIcon]="true"></app-list-to-popover>
 * <app-list-to-popover [popoverItems]="popoverData" [hideFirstItem]="true"></app-list-to-popover>
 * <app-list-to-popover [popoverItems]="popoverData" [isEllipsisMode]="true"></app-list-to-popover>
 */
@Component({
    selector: 'app-list-to-popover',
    templateUrl: './list-to-popover.component.html',
    styleUrls: ['./list-to-popover.component.scss'],
})
export class ListToPopoverComponent implements OnInit, AfterViewInit {
    @ViewChild('hiddenItem') hiddenItem: ElementRef;
    @ViewChild('visibleItem') visibleItem: ElementRef;

    /** Array with items for showing in tooltip */
    @Input() popoverItems: string[];
    @Input() hideFirstItem = false;
    @Input() showOnlyIcon = false;

    /** Mode for creating a popover for data which overflows a box where that overflow is hidden */
    @Input() isEllipsisMode = false;

    public popoverOptions: PopoverOptions = {};
    public isShowPopoverIcon = true;
    public popoverItem: string;

    constructor(private changeDetector: ChangeDetectorRef) {}

    ngOnInit() {
        this.initPopover();
    }

    ngAfterViewInit() {
        if (this.hiddenItem && this.visibleItem) {
            this.isShowPopoverIcon = this.hiddenItem.nativeElement.offsetWidth !== this.visibleItem.nativeElement.offsetWidth;

            // changeDetector used for avoiding 'Expression has changed after it was checked.' error
            this.changeDetector.detectChanges();
        }
    }

    public initPopover(): void {
        this.isShowPopoverIcon = (this.isEllipsisMode || this.popoverItems.length !== 1);
        this.popoverOptions.itemsArray = this.hideFirstItem ? this.popoverItems.slice(1) : this.popoverItems;
        this.popoverItem = this.showOnlyIcon ? '' : this.popoverItems[0];
    }
}
