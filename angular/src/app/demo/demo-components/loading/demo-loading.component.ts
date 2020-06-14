import { Component, OnInit } from '@angular/core';
import { ILoadingConfig } from '@shared/modules/loading/loading.config';

@Component({
    selector: 'app-demo-loading',
    templateUrl: './demo-loading.component.html',
    styleUrls: ['./demo-loading.component.scss'],
})
export class DemoLoadingComponent implements OnInit {
    public isShowLoading = true;
    public loadingConfig: ILoadingConfig = {
        fullScreenBackdrop: false,
        backdropBackgroundColour: 'transparent',
    };

    constructor() { }

    ngOnInit() {
    }

}
