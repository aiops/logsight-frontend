import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ElasticsearchDataPage } from './elasticsearch-data.page';

const routes: Routes = [{
  path: '',
  component: ElasticsearchDataPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElasticsearchDataRoutingModule {
}
