import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardPage} from './dashboard.page';
import {DashboardService} from './dashboard.service';

const routes: Routes = [{
  path: '',
  component: DashboardPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DashboardService]
})
export class DashboardRoutingModule {
}

