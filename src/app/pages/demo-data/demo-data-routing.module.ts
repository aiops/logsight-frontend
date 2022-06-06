import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DemoDataPage} from './demo-data.page';
import {DashboardService} from "../dashboard/dashboard.service";

const routes: Routes = [{
  path: '', component: DemoDataPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule],
  providers: [DashboardService]
})
export class DemoDataRoutingModule {
}
