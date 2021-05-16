import { Component, Input } from '@angular/core';
import { data } from './data';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'horizontal-bar-chart',
  styleUrls: ['./horizontal-bar-chart.component.scss'],
  templateUrl: './horizontal-bar-chart.component.html',
})
export class HorizontalBarChartComponent {
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
    var splitDate = val.toString().split(' ')
    var splitDate1 = splitDate[0].split('-')
    var date = splitDate1[2]+'-'+splitDate1[1]+'-'+splitDate1[0]+' '+splitDate[1]
    const datepipe: DatePipe = new DatePipe('en-US');
    let yourDate: Date = new Date(date + ' UTC');
    return (datepipe.transform(yourDate, 'shortTime').toString())
  }

}
