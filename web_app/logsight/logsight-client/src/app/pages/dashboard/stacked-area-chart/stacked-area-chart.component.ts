import { Component, Input } from '@angular/core';
import { data } from './data';
import * as shape from 'd3-shape'
@Component({
  selector: 'stacked-area-chart',
  styleUrls: ['./stacked-area-chart.component.scss'],
  templateUrl: './stacked-area-chart.component.html',
})
export class StackedAreaChartComponent {
  @Input() data = [];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  showGridLines: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;
  linearCurve = shape.curveBasis;
  colorScheme = {
    domain: ['#fff000', '#e85d04', '#393bff', '#00e1ff']
  };

  constructor() {
    this.data = data
  }

  onSelect(event) {
  }
}
