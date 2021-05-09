import { Component, Input } from '@angular/core';
import { data } from './data';

@Component({
  selector: 'vertical-bar-chart',
  styleUrls: ['./vertical-bar-chart.component.scss'],
  templateUrl: './vertical-bar-chart.component.html',
})
export class VerticalBarChartComponent {
  @Input() data = [];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Count';

  colorScheme = {
    domain: ['#5AA454']
  };

  constructor() {
    this.data = data
  }

}
