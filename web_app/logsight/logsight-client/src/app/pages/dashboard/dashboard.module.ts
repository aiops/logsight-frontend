import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { NbCardModule } from '@nebular/theme';
import { DashboardPage } from './dashboard.page';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PiechartComponent } from './chart-heatmap/piechart.component';
import { HeatmapComponent } from './pie-chart/heatmap.component';
import { StackedAreaChartComponent } from './stacked-area-chart/stacked-area-chart.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    ThemeModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule
  ],
  declarations: [
    DashboardPage,
    HeatmapComponent,
    PiechartComponent,
    StackedAreaChartComponent
  ],
})
export class DashboardModule { }
