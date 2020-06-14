import {
    Component,
    ElementRef,
    NgZone,
} from '@angular/core';
import { IHeaderParams } from 'ag-grid/main';
import { IHeaderAngularComp } from 'ag-grid-angular/main';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
    templateUrl: './header.html',
    styleUrls: ['./header.scss'],
})
export class HeaderComponent implements IHeaderAngularComp {
    public params: IHeaderParams;
    public sorted: string;

    constructor(private elementRef: ElementRef,
                private iconRegistry: MatIconRegistry,
                private sanitizer: DomSanitizer,
                private zone: NgZone,
    ) {
        this.elementRef = elementRef;

        this.iconRegistry.addSvgIcon(
            'arrow',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/arrow.svg'));
    }

    public agInit(params: IHeaderParams): void {
        this.params = params;
        this.params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));

        this.onSortChanged();
    }

    public onMenuClick() {
        this.params.showColumnMenu(this.querySelector('.customHeaderMenuButton'));
    }

    public onSortRequested(order, event) {
        this.params.setSort(order, event.shiftKey);
    }

    public onSortChanged() {
        if (this.params.column.isSortAscending()) {
            this.sorted = 'asc';
        } else if (this.params.column.isSortDescending()) {
            this.sorted = 'desc';
        } else {
            this.sorted = '';
        }
    }

    private querySelector(selector: string) {
        return <HTMLElement>this.elementRef.nativeElement.querySelector(
            '.customHeaderMenuButton', selector);
    }
}
