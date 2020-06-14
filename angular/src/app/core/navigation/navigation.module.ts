import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LoadingModule } from '@shared/modules';
import { NavigationComponent } from './navigation.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { UserNotificationsComponent } from './components/user-notifications/user-notifications.component';
import { NikoBotComponent } from './components/niko-bot/niko-bot.component';
import { NikoBotService } from './components/niko-bot/niko-bot.service';
import { RouterModule } from '@angular/router';
import { ShowdownModule } from 'ngx-showdown';
import { BlurAfterClickDirective } from '@app/core/navigation/blur-after-click.directive';
import { HelpdescModalComponent } from '@app/core/navigation/components/helpdesc/modals/helpdesc-modal/helpdesc-modal.component';
import { HelpdescComponent } from '@app/core/navigation/components/helpdesc/helpdesc.component';
import { UsersStoreService } from '@shared/stores/users-store.service';
import { SearchBoxStoreService } from '@shared/stores/search-box-store.service';
import { NikobotAutocompleteModule } from '@shared/modules/nikobot-autocomplete/nikobot-autocomplete.module';

@NgModule({
    declarations: [
        NavigationComponent,
        UserAvatarComponent,
        UserNotificationsComponent,
        NikoBotComponent,
        BlurAfterClickDirective,
        HelpdescComponent,
        HelpdescModalComponent,
    ],
    imports: [
        SharedModule,
        LoadingModule,
        NikobotAutocompleteModule,
        RouterModule,
        ShowdownModule,
    ],
    exports: [
        NavigationComponent,
        RouterModule,
    ],
    providers: [
        NikoBotService,
        UsersStoreService,
        SearchBoxStoreService,
    ],
    entryComponents: [
        HelpdescModalComponent,
    ],
})

export class NavigationModule {
}
