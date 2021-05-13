import { Component, Input } from '@angular/core';
import { data } from './data';
import * as shape from 'd3-shape'
import {locale} from "d3";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'stacked-area-chart',
  styleUrls: ['./stacked-area-chart.component.scss'],
  templateUrl: './stacked-area-chart.component.html',
})
export class StackedAreaChartComponent {
  @Input() data = [];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  showGridLines: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = false;
  linearCurve = shape.curveMonotoneX;
  colorScheme = {
    domain: [ '#f0ff00', '#d94800', '#ff006e', '#8338ec', '#3a86ff']
  };

  dateTickFormatting(val: any) {
    var splitDate = val.toString().split(' ')
    var splitDate1 = splitDate[0].split('-')
    var date = splitDate1[2]+'-'+splitDate1[1]+'-'+splitDate1[0]+' '+splitDate[1]
    const datepipe: DatePipe = new DatePipe('en-US');
    let yourDate: Date = new Date(date + ' UTC');
    return (datepipe.transform(yourDate, 'shortTime').toString())
  }

  constructor() {
    this.data = data
  }
  onSelect(event) {
  }
}


