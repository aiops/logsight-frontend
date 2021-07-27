import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntegrationPage } from './integration.page';

const routes: Routes = [{
  path: '',
  component: IntegrationPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationRoutingModule {
}
