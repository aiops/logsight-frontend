import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DemoDataPage} from './demo-data.page';
import {IncidentsService} from "../../incidents/services/incidents.service";

const routes: Routes = [{
  path: '', component: DemoDataPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule],
  providers: [IncidentsService]
})
export class DemoDataRoutingModule {
}
