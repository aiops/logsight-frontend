import { NgModule } from '@angular/core';
import { KibanaPage } from './kibana.page';
import { KibanaRoutingModule } from './kibana-routing.module';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
    imports: [
        KibanaRoutingModule,
        MatDialogModule
    ],
  declarations: [
    KibanaPage,
  ],
})
export class KibanaModule {
}
