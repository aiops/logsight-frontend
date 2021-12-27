import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SampleDataPage } from './sample-data.page';

const routes: Routes = [{
  path: '',
  component: SampleDataPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleDataRoutingModule {
}
