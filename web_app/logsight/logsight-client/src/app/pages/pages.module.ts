import { NgModule } from '@angular/core';
import { NbDialogService, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IntegrationService } from '../@core/service/integration.service';
import { VariableAnalysisService } from '../@core/service/variable-analysis.service';
import { MessagingService } from '../@core/service/messaging.service';
import { LoadingComponent } from '../@core/components/loading/loading.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule
  ],
  declarations: [
    PagesComponent,
    LoadingComponent,
  ],
  exports: [
    LoadingComponent
  ],
  providers: [IntegrationService, VariableAnalysisService, MessagingService, NbDialogService]
})
export class PagesModule {
}
