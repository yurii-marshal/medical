import {
    Component,
    OnInit,
    Input,
} from '@angular/core';

import { LoadingConfigService } from './loading.service';
import {
    ILoadingConfig,
    LoadingConfig,
    ANIMATION_TYPES,
} from './loading.config';

/**
 *
 * AppLoadingComponent should be used when data is loading from server or request is proceed.
 * It has `config` input object and `show` input property.
 *
 * Location:
 * -------------------
 * **AppLoadingComponent**
 * <example-url>http://niko.loc:8082/v2#/demo-components/loading</example-url>
 *
 * @example
 * <app-loading [show]="isShowLoading" [config]="loadingConfig"></app-loading>
 */
@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class AppLoadingComponent implements OnInit {
    /** Input determine is show loading or not */
    @Input() show: boolean;

    /** Object with set of config for representing AppLoadingComponent */
    @Input() config: ILoadingConfig = new LoadingConfig();

    public ANIMATION_TYPES = ANIMATION_TYPES;

    public loadingConfig: ILoadingConfig = {
        animationType: '',
        backdropBackgroundColour: '',
        backdropBorderRadius: '',
        fullScreenBackdrop: false,
        primaryColour: '',
        secondaryColour: '',
        tertiaryColour: '',
    };

    private defaultConfig: ILoadingConfig = {
        animationType: ANIMATION_TYPES.standartCircles,
        backdropBackgroundColour: 'rgba(0, 0, 0, 0.3)',
        backdropBorderRadius: '0px',
        fullScreenBackdrop: false,
        primaryColour: '#ffffff',
        secondaryColour: '#ffffff',
        tertiaryColour: '#ffffff',
    };

    constructor(private loadingConfigService: LoadingConfigService) { }

    ngOnInit() {
        for (const option in this.defaultConfig) {
            if (typeof this.loadingConfig[option] === 'boolean') {
                if (this.config[option] != null) {
                    this.loadingConfig[option] = this.config[option];
                    continue;
                }

                this.loadingConfig[option] =
                    this.loadingConfigService.loadingConfig[option] != null ?
                        this.loadingConfigService.loadingConfig[option] :
                        this.defaultConfig[option];
            } else {
                if (this.config[option] != null) {
                    this.loadingConfig[option] = this.config[option];
                    continue;
                }

                this.loadingConfig[option] =
                    this.loadingConfigService.loadingConfig[option] != null ?
                        this.loadingConfigService.loadingConfig[option] :
                        this.defaultConfig[option];
            }
        }
    }

    public getAnimationType(animationType: string): string {
        let animationTypeSet: string;

        switch (animationType) {
            case ANIMATION_TYPES.standartCircles:
                animationTypeSet = ANIMATION_TYPES.standartCircles;
                break;
            default:
                animationTypeSet = ANIMATION_TYPES.standartCircles;
        }
        return animationTypeSet;
    }
}
