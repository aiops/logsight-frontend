import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { PiechartComponent } from './pie-chart/piechart.component';
import { StackedAreaChartComponent } from '../dashboard/stacked-area-chart/stacked-area-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { GroupedVerticalBarChartComponent } from './grouped-vertical-bar-chart/grouped-vertical-bar-chart.component';
import { VerticalBarChartComponent } from './vertical-bar-chart/vertical-bar-chart.component';
import {GroupedVerticalBarChart2dComponent} from "./grouped-vertical-bar-chart-2d/grouped-vertical-bar-chart2d.component";
import { HorizontalBarChartComponent } from './horizontal-bar-chart/horizontal-bar-chart.component';

@NgModule({
  imports: [
    NgxChartsModule,
    ChartModule,
  ],
  exports: [
    PiechartComponent,
    StackedAreaChartComponent,
    HeatmapComponent,
    LineChartComponent,
    GroupedVerticalBarChartComponent,
    VerticalBarChartComponent,
    GroupedVerticalBarChart2dComponent,
    HorizontalBarChartComponent
  ],
  declarations: [
    HeatmapComponent,
    PiechartComponent,
    StackedAreaChartComponent,
    LineChartComponent,
    GroupedVerticalBarChartComponent,
    VerticalBarChartComponent,
    GroupedVerticalBarChart2dComponent,
    HorizontalBarChartComponent
  ]
})
export class ChartsWrapperModule {
}
