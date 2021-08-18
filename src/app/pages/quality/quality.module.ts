import { NgModule } from '@angular/core';
import { QualityRoutingModule } from './quality-routing.module';
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
import { QualityService} from './quality.service';
import { NvD3Module } from 'ng2-nvd3';
import { QualityPage } from './quality.page';
import { PagesModule } from '../pages.module';
import { FormsModule } from '@angular/forms';
import { ChartsWrapperModule } from '../charts-wrapper-module/charts-wrapper.module';
import {DashboardService} from "../dashboard/dashboard.service";
import {BarChartModule} from "@swimlane/ngx-charts";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import {NgxGaugeModule} from "ngx-gauge";

@NgModule({
  imports: [
    QualityRoutingModule,
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
    QualityPage,
  ],
  providers: [QualityService, DashboardService]
})
export class QualityModule {
}
