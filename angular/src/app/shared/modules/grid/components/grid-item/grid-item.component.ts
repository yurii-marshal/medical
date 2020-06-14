import {
    Component,
    OnInit,
    Input,
} from '@angular/core';
import { ILoadingConfig } from '../../../loading/loading.config';

@Component({
    selector: 'app-grid-item',
    templateUrl: './grid-item.component.html',
    styleUrls: ['./grid-item.component.scss'],
})
export class GridItemComponent implements OnInit {
    @Input() isAppNoContent = true;
    @Input() isAllItemsLoaded = false;

    public loaderConfig: ILoadingConfig = {
        fullScreenBackdrop: false,
        backdropBackgroundColour: 'transparent',
    };

    constructor() {
    }

    ngOnInit() {
    }

}
