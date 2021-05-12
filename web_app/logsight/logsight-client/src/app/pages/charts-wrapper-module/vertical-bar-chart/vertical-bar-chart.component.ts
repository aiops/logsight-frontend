import { Component, Input } from '@angular/core';
import { data } from './data';
import {DatePipe} from "@angular/common";

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
    domain: [
      '#f0ff00'
    ]
  };

  constructor() {
    this.data = data
  }
  dateTickFormatting(val: any) {
    const datepipe: DatePipe = new DatePipe('en-US');
    let yourDate: Date = new Date(val);
    return (datepipe.transform(yourDate, 'shortTime').toString())
  }
}
