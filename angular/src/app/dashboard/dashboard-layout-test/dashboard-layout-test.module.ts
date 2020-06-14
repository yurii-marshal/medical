import { TestComponentComponent } from './test-component/test-component.component';
import { DashboardTestRoutingModule } from './dashboard-layout-test-routing.module';
import { NgModule } from '@angular/core';


@NgModule({
    declarations: [
        TestComponentComponent,
    ],
    imports: [
        DashboardTestRoutingModule,
    ],
    providers: [],
})
export class DashboardTestModule { }
