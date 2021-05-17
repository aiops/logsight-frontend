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
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#f0ff00', '#d94800', '#ff006e', '#8338ec', '#3a86ff']
  };

  constructor() {
  }

}
