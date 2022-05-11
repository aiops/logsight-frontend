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
import {NbIconModule, NbTooltipModule} from "@nebular/theme";
import {GroupedHorizontalBarChart2dComponent} from "./grouped-horizontal-bar-chart-2d/grouped-horizontal-bar-chart2d.component";
import {HeatmapCompareComponent} from "./heatmap-compare/heatmap-compare.component";
import {dataService} from "./pie-chart/data.service";

@NgModule({
  imports: [
    NgxChartsModule,
    ChartModule,
    NbIconModule,
    NbTooltipModule,
  ],
    exports: [
        PiechartComponent,
        StackedAreaChartComponent,
        HeatmapComponent,
        LineChartComponent,
        GroupedVerticalBarChartComponent,
        VerticalBarChartComponent,
        GroupedVerticalBarChart2dComponent,
        HorizontalBarChartComponent,
        GroupedHorizontalBarChart2dComponent,
      HeatmapCompareComponent
    ],
    declarations: [
        HeatmapComponent,
        PiechartComponent,
        StackedAreaChartComponent,
        LineChartComponent,
        GroupedVerticalBarChartComponent,
        VerticalBarChartComponent,
        GroupedVerticalBarChart2dComponent,
        HorizontalBarChartComponent,
        GroupedHorizontalBarChart2dComponent,
      HeatmapCompareComponent],
  providers: [
    dataService
  ]
})
export class ChartsWrapperModule {
}
