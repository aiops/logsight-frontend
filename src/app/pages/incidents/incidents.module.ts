import {NgModule} from '@angular/core';
import {IncidentsRoutingModule} from './incidents-routing.module';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule, NbSelectModule, NbTooltipModule,
  NbTreeGridModule
} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';
import {IncidentsService} from './incidents.service';
import {NvD3Module} from 'ng2-nvd3';
import {IncidentsPage} from './incidents.page';
import {PagesModule} from '../pages.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChartsWrapperModule} from '../charts-wrapper-module/charts-wrapper.module';
import {DashboardService} from "../dashboard/dashboard.service";
import {BarChartModule} from "@swimlane/ngx-charts";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import {NgScrollbarModule} from "ngx-scrollbar";

@NgModule({
  imports: [
    IncidentsRoutingModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NvD3Module,
    FormsModule,
    NbButtonModule,
    PagesModule,
    ChartsWrapperModule,
    NbPopoverModule,
    NbTooltipModule,
    NbSelectModule,
    BarChartModule,
    TourMatMenuModule,
    NgScrollbarModule,
    ReactiveFormsModule
  ],
  declarations: [
    IncidentsPage,
  ],
  providers: [IncidentsService, DashboardService, ReactiveFormsModule]
})
export class IncidentsModule {
}
