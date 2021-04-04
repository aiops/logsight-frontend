import { Component, Input } from '@angular/core';

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
  legendTitle: string = 'Years';

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };

  constructor() {
  }

}
