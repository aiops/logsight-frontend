import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IntegrationService } from '../@core/service/integration.service';
import { VariableAnalysisService } from '../@core/service/variable-analysis.service';

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
  providers: [IntegrationService, VariableAnalysisService]
})
export class PagesModule {
}
