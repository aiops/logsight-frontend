import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from '../@core/components/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'send-logs',
      loadChildren: () => import('./quickstart/quickstart.module')
        .then(m => m.QuickstartModule),
    },
    {
      path: 'quality',
      loadChildren: () => import('./quality/quality.module')
        .then(m => m.QualityModule),
    },
    {
      path: 'compare',
      loadChildren: () => import('./log-compare/log-compare.module')
        .then(m => m.LogCompareModule),
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
      path: 'file-upload',
      loadChildren: () => import('./file-upload/file-upload.module')
        .then(m => m.FileUploadModule),
    },{
      path: 'sample-data',
      loadChildren: () => import('./sample-data/sample-data.module')
        .then(m => m.SampleDataModule),
    },
    {
      path: 'elasticsearch-data',
      loadChildren: () => import('./elasticsearch-data/elasticsearch-data.module')
        .then(m => m.ElasticsearchDataModule),
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
      path: 'kibana',
      loadChildren: () => import('./kibana/kibana.module')
        .then(m => m.KibanaModule),
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
