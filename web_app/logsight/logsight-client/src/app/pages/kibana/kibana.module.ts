import { NgModule } from '@angular/core';
import { KibanaPage } from './kibana.page';
import { KibanaRoutingModule } from './kibana-routing.module';

@NgModule({
  imports: [
    KibanaRoutingModule
  ],
  declarations: [
    KibanaPage,
  ],
})
export class KibanaModule {
}
