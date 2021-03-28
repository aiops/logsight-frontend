import { NgModule } from '@angular/core';
import { NbDialogService, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IntegrationService } from '../@core/service/integration.service';
import { VariableAnalysisService } from '../@core/service/variable-analysis.service';
import { MessagingService } from '../@core/service/messaging.service';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
  ],
  declarations: [
    PagesComponent,
  ],
  providers: [IntegrationService, VariableAnalysisService, MessagingService, NbDialogService]
})
export class PagesModule {
}
