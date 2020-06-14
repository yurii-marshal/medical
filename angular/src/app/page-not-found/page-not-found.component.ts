import { Component, OnDestroy } from '@angular/core';
import { ProfileService } from '@shared/services/profile.service';
import { PubSubService } from '@shared/services/pub-sub.service';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
})

export class PageNotFoundComponent implements OnDestroy {
    public title = 'app';

    constructor(
        private profileService: ProfileService,
        private pubsub: PubSubService,
    ) {
        this.pubsub.$pub('iframe', true);
        this.pubsub = pubsub;
    }

    ngOnDestroy(): void {
        this.pubsub.$pub('iframe', false);
    }
}
