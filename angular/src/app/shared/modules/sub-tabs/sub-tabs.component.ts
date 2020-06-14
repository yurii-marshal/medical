import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { RouterNavigatorService } from '../../services/navigation-router.service';
import { SubTab } from './sub-tab.interface';

/**
 * 'Sub-Tabs' Component
 *
 * Location:
 * -------------------
 * **@link SubTabsModule**
 *
 * <example-url>http://niko.loc:8082/v2#/demo-components/subtabs</example-url>
 *
 * @example
 * <app-sub-tabs [tabs]="tabs"></app-sub-tabs>
 */
@Component({
    selector: 'app-sub-tabs',
    templateUrl: './sub-tabs.html',
    styleUrls: ['./sub-tabs.scss'],
})

export class SubTabsComponent implements OnInit {

    @Input() tabs: SubTab[];

    @Output() tabClick = new EventEmitter<SubTab>();

    constructor(
        private routerNavigatorService: RouterNavigatorService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.tabs.forEach((tab: SubTab) => {
            tab.isActive = tab.url === this.router.url;
        });
    }

    navigate(tab: SubTab) {
        if (localStorage.getItem('loggedIn') === 'true') {
            if (!!this.tabClick.observers.length) {
                this.tabClick.emit(tab);
            } else {
                this.routerNavigatorService.navigate([ tab.url ]);
            }
        }
    }
}
