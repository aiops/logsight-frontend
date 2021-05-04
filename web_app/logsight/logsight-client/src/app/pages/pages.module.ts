import { NgModule } from '@angular/core';
import {NbCardModule, NbDialogService, NbMenuModule, NbSelectModule} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IntegrationService } from '../@core/service/integration.service';
import { VariableAnalysisService } from '../@core/service/variable-analysis.service';
import { MessagingService } from '../@core/service/messaging.service';
import { LoadingComponent } from '../@core/components/loading/loading.component';
import { RangeDateTimeComponent } from '../@core/components/range-date-time/range-date-time.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { RelativeTimeComponent } from '../@core/components/relative-time/relative-time.component';
import { VariableAnalysisTemplateResolver } from '../@core/components/app/variable-analysis-template-resolver';
import { VariableAnalysisTemplate } from '../@core/components/app/variable-analysis-template';
import { HostDirective } from '../@core/components/app/host.directive';
import { SpecificTemplateModalComponent } from '../@core/components/specific-template-modal/specific-template-modal.component';
import {ChartsWrapperModule} from "./charts-wrapper-module/charts-wrapper.module";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbSelectModule,
    NbCardModule,
    ChartsWrapperModule
  ],
  declarations: [
    PagesComponent,
    LoadingComponent,
    RangeDateTimeComponent,
    RelativeTimeComponent,
    VariableAnalysisTemplateResolver,
    VariableAnalysisTemplate,
    HostDirective, SpecificTemplateModalComponent
  ],
  exports: [
    LoadingComponent,
    RangeDateTimeComponent,
    RelativeTimeComponent,
    VariableAnalysisTemplateResolver
  ],
  providers: [IntegrationService, VariableAnalysisService, MessagingService, NbDialogService]
})
export class PagesModule {
}
