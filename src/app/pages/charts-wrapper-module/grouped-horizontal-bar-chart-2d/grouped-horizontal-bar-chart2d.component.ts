import { Component, Input } from '@angular/core';
import { data } from './data';
import * as moment from "moment";
@Component({
  selector: 'grouped-horizontal-bar-chart-2d',
  styleUrls: ['./grouped-horizontal-bar-chart2d.component.scss'],
  templateUrl: './grouped-horizontal-bar-chart2d.component.html',
})
export class GroupedHorizontalBarChart2dComponent {
  @Input() data = [];
  @Input() heatmapHeight = "'150px"
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = false;
  yAxisLabel: string = '';
  legendTitle: string = '';

  colorScheme = {
    domain: [
      '#00d9ff',
      '#82ff8e'
    ]
  };


  constructor() {
    this.data = data
  }

}




