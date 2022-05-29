import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SendLogsPage} from './send-logs-page.component';

const routes: Routes = [{
  path: '',
  component: SendLogsPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendLogsRoutingModule {
}
