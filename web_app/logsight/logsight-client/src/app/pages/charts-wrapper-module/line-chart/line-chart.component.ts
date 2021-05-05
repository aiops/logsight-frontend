import { Component, Input } from '@angular/core';
@Component({
  selector: 'line-chart',
  styleUrls: ['./line-chart.component.scss'],
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent {
  @Input() data = [];

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff']
  };

  constructor() {
  }

}
