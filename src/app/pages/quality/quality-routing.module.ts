import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { QualityPage } from './quality.page';

const routes: Routes = [{
  path: '',
  component: QualityPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QualityRoutingModule {
}
