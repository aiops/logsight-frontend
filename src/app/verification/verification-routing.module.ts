import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {VerificationComponent} from './verification.component';
import {InsightsComponent} from "./insights/insights.component";

const routes: Routes = [
  {
    path: '', component: VerificationComponent,
    children: [
      {path: 'overview', component: OverviewComponent},
      {path: 'insights', component: InsightsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationRoutingModule {
}
