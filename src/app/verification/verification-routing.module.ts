import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { VerificationComponent } from './verification.component';

const routes: Routes = [
  { path: 'verification', component: VerificationComponent,
    children: [
      { path: 'overview', component: OverviewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationRoutingModule { }
