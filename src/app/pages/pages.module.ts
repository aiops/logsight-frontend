import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogService, NbMenuModule, NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { IntegrationService } from '../@core/service/integration.service';
import { VariableAnalysisService } from '../@core/service/variable-analysis.service';
import { MessagingService } from '../@core/service/messaging.service';
import { LoadingComponent } from '../@core/components/loading/loading.component';
import { RangeDateTimeComponent } from '../@core/components/range-date-time/range-date-time.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { RelativeTimeComponent } from '../@core/components/relative-time/relative-time.component';
import { VariableAnalysisTemplateResolver } from '../@core/components/app/variable-analysis-template-resolver';
import { VariableAnalysisTemplate } from '../@core/components/app/variable-analysis-template';
import { HostDirective } from '../@core/components/app/host.directive';
import { SpecificTemplateModalComponent } from '../@core/components/specific-template-modal/specific-template-modal.component';
import {ChartsWrapperModule} from "./charts-wrapper-module/charts-wrapper.module";
import { ElasticCustomDatepickerComponent } from '../@core/components/elastic-custom-datepicker/elastic-custom-datepicker.component';
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import { SortDirective } from '../@core/directives/sort-directive';
import { CreatePredefinedTimeModal } from '../@core/components/create-predefined-time-modal/create-predefined-time-modal.component';
import { PredefinedTimesComponent } from '../@core/components/predefined-times/predefined-times.component';
import {ButtonModule} from "primeng/button";

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NbSelectModule,
        NbCardModule,
        ChartsWrapperModule,
        FormsModule,
        NbButtonModule,
        TourMatMenuModule,
        ButtonModule
    ],
  declarations: [
    PagesComponent,
    LoadingComponent,
    RangeDateTimeComponent,
    RelativeTimeComponent,
    VariableAnalysisTemplateResolver,
    VariableAnalysisTemplate,
    HostDirective,
    SpecificTemplateModalComponent,
    ElasticCustomDatepickerComponent,
    PredefinedTimesComponent,
    SortDirective,
    CreatePredefinedTimeModal
  ],
  exports: [
    LoadingComponent,
    RangeDateTimeComponent,
    RelativeTimeComponent,
    VariableAnalysisTemplateResolver,
    ElasticCustomDatepickerComponent,
    SortDirective,
    PredefinedTimesComponent
  ],
  providers: [IntegrationService, VariableAnalysisService, MessagingService, NbDialogService]
})
export class PagesModule {
}
