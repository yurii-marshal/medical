import { NgModule } from '@angular/core';
import { GridComponent } from './grid.component';
import { GridFilterComponent } from './components/grid-filter/grid-filter.component';
import { GridItemComponent } from './components/grid-item/grid-item.component';
import { SharedModule } from '../../shared.module';
import { LoadingModule } from '../loading/loading.module';
import { TransformDataService } from './services/transform-data.service';
import { NoContentModule } from '../../modules/no-content/no-content.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';

@NgModule({
    imports: [
        SharedModule,
        LoadingModule,
        NoContentModule,
        OwlDateTimeModule,
    ],
    providers: [TransformDataService],
    declarations: [GridComponent, GridFilterComponent, GridItemComponent],
    exports: [
        GridComponent,
        GridFilterComponent,
        GridItemComponent,
        OwlDateTimeModule,
    ],
})
export class GridModule {
}
