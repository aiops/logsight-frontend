import { Component, Input } from '@angular/core';
import { data } from './data';
import {DatePipe} from "@angular/common";
import * as moment from "moment";
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
  showXAxisLabel: boolean = false;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = false;
  yAxisLabel: string = '';
  legendTitle: string = '';

  colorScheme = {
    domain: ['#ffe700', '#7fd900', '#03ffa6', '#37bdfc',
      '#3a86ff', '#035eff', '#1900ff', '#8900ff',
      '#c000ff', '#ff00c8', '#ff009d', '#ff0059',
      '#ff001f', '#840000', '#6d0000']
  };

  constructor() {
    this.data = data
  }

  dateTickFormatting(val: any) {
    if (val.length > 0) {
      var date = moment.utc(val, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
      var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
      var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('hh:mm:ss A');
      return local.toString()
    } else {
      return val
    }
  }
}
