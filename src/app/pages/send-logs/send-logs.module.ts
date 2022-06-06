import {NgModule} from '@angular/core';
import {NbLayoutModule, NbRouteTabsetModule,} from '@nebular/theme';
import {SendLogsRoutingModule} from './send-logs-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {SendLogsPage} from './send-logs-page.component';
import {BdcWalkModule} from "bdc-walkthrough";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import {FileUploadModule} from "@iplab/ngx-file-upload";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbRouteTabsetModule,
    SendLogsRoutingModule,
    BdcWalkModule,
    TourMatMenuModule,
    NbLayoutModule,
    FileUploadModule,
    CardModule,
    ButtonModule
  ],
  providers: [],
  declarations: [
    SendLogsPage,
  ],
})
export class SendLogsModule {
}
