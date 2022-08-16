import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IncidentsOverviewComponent} from './overview/incidents-overview.component';
import {IncidentsComponent} from './incidents.component';
import {IncidentsInsightsComponent} from "./insights/incidents-insights.component";
import {IncidentsAnalyticsComponent} from "./analytics/incidents-analytics.component";

const routes: Routes = [
  {
    path: '', component: IncidentsComponent,
    children: [
      {path: 'overview', component: IncidentsOverviewComponent},
      {path: 'insights', component: IncidentsInsightsComponent},
      {path: 'analytics', component: IncidentsAnalyticsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentsRoutingModule {
}
