import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbSelectModule, NbTooltipModule, NbTreeGridModule
} from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { VariableAnalysisRoutingModule } from './variable-analysis-routing.module';
import { VariableAnalysisPage } from './variable-analysis.page';
import { VariableAnalysisTemplate } from '../../@core/components/app/variable-analysis-template';
import { PagesModule } from '../pages.module';
import { ChartsWrapperModule } from '../charts-wrapper-module/charts-wrapper.module';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { IncidentsService } from '../incidents/incidents.service';
import { DashboardService } from '../dashboard/dashboard.service';
import {NgScrollbarModule} from "ngx-scrollbar";

@NgModule({
    imports: [
        VariableAnalysisRoutingModule,
        ThemeModule,
        NgxChartsModule,
        ChartModule,
        NbCardModule,
        NbInputModule,
        NbButtonModule,
        ReactiveFormsModule,
        NbSelectModule,
        PagesModule,
        ChartsWrapperModule,
        NbPopoverModule,
        TourMatMenuModule,
        NbIconModule,
        NbTooltipModule,
        NbTreeGridModule,
        NgScrollbarModule
    ],
  declarations: [VariableAnalysisPage],
  entryComponents: [VariableAnalysisTemplate],
  providers: [DashboardService]
})
export class VariableAnalysisModule {
}
