import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from '../@core/components/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'quickstart',
      loadChildren: () => import('./quickstart/quickstart.module')
        .then(m => m.QuickstartModule),
    },
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module')
        .then(m => m.DashboardModule),
    },
    {
      path: 'incidents',
      loadChildren: () => import('./incidents/incidents.module')
        .then(m => m.IncidentsModule),
    },
    {
      path: 'integration',
      loadChildren: () => import('./integration/integration.module')
        .then(m => m.IntegrationModule),
    },
    {
      path: 'variable-analysis',
      loadChildren: () => import('./variable-analysis/variable-analysis.module')
        .then(m => m.VariableAnalysisModule),
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile/profile.module')
        .then(m => m.ProfileModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
