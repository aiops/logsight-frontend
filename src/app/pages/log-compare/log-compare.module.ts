import { NgModule } from '@angular/core';
import {LogCompareRoutingModule} from "./log-compare-routing.module";
import {
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbPopoverModule, NbSelectModule, NbTooltipModule,
    NbTreeGridModule
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { LogCompareService} from './log-compare.service';
import { NvD3Module } from 'ng2-nvd3';
import { LogComparePage } from './log-compare.page';
import { PagesModule } from '../pages.module';
import { FormsModule } from '@angular/forms';
import { ChartsWrapperModule } from '../charts-wrapper-module/charts-wrapper.module';
import {DashboardService} from "../dashboard/dashboard.service";
import {BarChartModule} from "@swimlane/ngx-charts";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import {NgxGaugeModule} from "ngx-gauge";

@NgModule({
  imports: [
    LogCompareRoutingModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
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
    NgxGaugeModule
  ],
  declarations: [
    LogComparePage,
  ],
  providers: [LogCompareService, DashboardService]
})
export class LogCompareModule {
}
