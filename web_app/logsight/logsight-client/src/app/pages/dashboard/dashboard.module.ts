import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { NbCardModule } from '@nebular/theme';
import { DashboardPage } from './dashboard.page';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StackedAreaChartComponent } from './stacked-area-chart/stacked-area-chart.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { PiechartComponent } from './pie-chart/piechart.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    DashboardRoutingModule,
    ThemeModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
    Ng2SmartTableModule,
    NgxDatatableModule
  ],
  declarations: [
    DashboardPage,
    HeatmapComponent,
    PiechartComponent,
    StackedAreaChartComponent
  ],
})
export class DashboardModule {
}
