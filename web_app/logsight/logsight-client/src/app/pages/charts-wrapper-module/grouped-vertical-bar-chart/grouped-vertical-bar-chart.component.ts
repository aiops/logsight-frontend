import { Component, Input } from '@angular/core';
import { data } from './data';
import {DatePipe} from "@angular/common";
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
    domain: ['#ffbe0b', '#d94800', '#ff006e', '#8338ec', '#3a86ff']
  };

  constructor() {
    this.data = data
  }

  dateTickFormatting(val: any) {
    const datepipe: DatePipe = new DatePipe('en-US');
    let yourDate: Date = new Date(val + ' UTC-1');
    return (datepipe.transform(yourDate, 'shortTime').toString())
  }

}
