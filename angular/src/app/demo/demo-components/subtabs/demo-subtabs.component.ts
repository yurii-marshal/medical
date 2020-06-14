import { Component, OnInit } from '@angular/core';
import { SubTab } from '@shared/modules/sub-tabs/sub-tab.interface';

@Component({
    selector: 'app-demo-subtabs',
    templateUrl: './demo-subtabs.component.html',
    styleUrls: ['./demo-subtabs.component.scss'],
})
export class DemoSubtabsComponent implements OnInit {
    public tabs: SubTab[] = [
        {
            url: '',
            text: 'Tab 1',
        },
        {
            url: '',
            text: 'Tab 2',
        },
        {
            url: '',
            text: 'Tab 3',
        },
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
