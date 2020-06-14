import {
    Injectable,
    Inject,
    Optional,
} from '@angular/core';
import {
    ANIMATION_TYPES,
    ILoadingConfig,
    LoadingConfig,
} from './loading.config';

@Injectable()
export class LoadingConfigService {
    public loadingConfig: ILoadingConfig;

    constructor(@Optional() @Inject('loadingConfig') private config: ILoadingConfig) {
        this.loadingConfig = config || new LoadingConfig({
            animationType: ANIMATION_TYPES.standartCircles,
            backdropBackgroundColour: 'rgba(255, 255, 255, 0.5)',
            backdropBorderRadius: '0px',
        });
    }
}
