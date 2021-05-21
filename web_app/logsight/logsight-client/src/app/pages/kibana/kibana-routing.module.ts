import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { KibanaPage } from './kibana.page';

const routes: Routes = [{
  path: '',
  component: KibanaPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KibanaRoutingModule {
}
