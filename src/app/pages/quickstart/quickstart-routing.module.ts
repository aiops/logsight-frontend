import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { QuickstartPage } from './quickstart.page';

const routes: Routes = [{
  path: '',
  component: QuickstartPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickstartRoutingModule {
}
