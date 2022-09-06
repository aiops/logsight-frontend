import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {NotFoundComponent} from '../@core/components/not-found/not-found.component';

const routes: Routes = [{
  path: '', component: PagesComponent, children: [{
    path: 'send-logs', loadChildren: () => import('./send-logs/send-logs.module')
      .then(m => m.SendLogsModule),
  }, {
    path: 'compare', loadChildren: () => import('../verification/verification.module')
      .then(m => m.VerificationModule),
  }, {
    path: 'incidents', loadChildren: () => import('../incidents/incidents.module')
      .then(m => m.IncidentsModule),
  }, {
    path: 'demo-data', loadChildren: () => import('./demo-data/demo-data.module')
      .then(m => m.DemoDataModule),
  }, {
    path: 'profile', loadChildren: () => import('./profile/profile.module')
      .then(m => m.ProfileModule),
  },{
    path: '', redirectTo: 'incidents', pathMatch: 'full',
  }, {
    path: '**', component: NotFoundComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule],
})
export class PagesRoutingModule {
}
