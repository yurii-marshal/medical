import { ModuleWithProviders, NgModule } from '@angular/core';
import { PubSubService } from '../services/pub-sub.service';

@NgModule()
export class PubSubModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: PubSubModule,
      providers: [
        PubSubService,
      ],
    };
  }
}
