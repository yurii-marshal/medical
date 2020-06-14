import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-demo-list-to-popover',
    templateUrl: './demo-list-to-popover.component.html',
    styleUrls: ['./demo-list-to-popover.component.scss'],
})
export class DemoListToPopoverComponent implements OnInit {
    public popoverData = [];
    public popoverEllipsisData = [];
    public gridHeaderItems = [];

    constructor() {
        this.popoverData = [
            '1 Pike Dr, Wayne, NJ, 07470',
            '1 Pike Dr, Ste 450, Wayne, NJ, 07470',
            '1 Pike Dr, Wayne, NJ, 07470',
            '1 Pike Dr, 128, Wayne, NJ, 07470',
            '1 Pike Dr, Wayne, NJ, 07470',
        ];

        this.popoverEllipsisData = [
            '1 Pike Dr, Ste 450, Wayne, NJ, 07470',
            // '1 Pike Dr, Ste 450',
        ];
    }

    ngOnInit() {
    }

}
