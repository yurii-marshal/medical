import { Component, OnInit } from '@angular/core';
import { PopoverOptions } from '@shared/directives/popover/popover.interface';

@Component({
    selector: 'app-demo-popover',
    templateUrl: './demo-popover.component.html',
    styleUrls: ['./demo-popover.component.scss'],
})
export class DemoPopoverComponent implements OnInit {

    public popoverOptions: PopoverOptions = {};

    constructor() {
    }

    ngOnInit() {
        this.popoverOptions.itemsArray = [
            '111111111',
            '222222222',
            '33333333',
            '444444444',
            '555555555',
            '6666666666',
            '777777777',
        ];
    }

}
