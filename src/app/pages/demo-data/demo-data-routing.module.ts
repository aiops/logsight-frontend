import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DemoDataPage} from './demo-data.page';

const routes: Routes = [{
  path: '', component: DemoDataPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule]
})
export class DemoDataRoutingModule {
}
