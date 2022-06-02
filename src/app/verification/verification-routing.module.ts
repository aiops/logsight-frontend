import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VerificationOverviewComponent} from './overview/verification-overview.component';
import {VerificationComponent} from './verification.component';
import {VerificationInsightsComponent} from "./insights/verification-insights.component";
import {VerificationAnalyticsComponent} from "./analytics/verification-analytics.component";

const routes: Routes = [
  {
    path: '', component: VerificationComponent,
    children: [
      {path: 'overview', component: VerificationOverviewComponent},
      {path: 'insights', component: VerificationInsightsComponent},
      {path: 'analytics', component: VerificationAnalyticsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationRoutingModule {
}
