import { Component, Input } from '@angular/core';
import { data } from './data';
@Component({
  selector: 'grouped-vertical-bar-chart',
  styleUrls: ['./grouped-vertical-bar-chart.component.scss'],
  templateUrl: './grouped-vertical-bar-chart.component.html',
})
export class GroupedVerticalBarChartComponent {
  @Input() data = [];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Number';
  legendTitle: string = '';

  colorScheme = {
    domain: ['#fff000', '#e85d04', '#393bff', '#00e1ff']
  };

  constructor() {
    this.data = data
  }

}
