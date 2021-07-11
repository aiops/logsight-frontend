import { Component, Input } from '@angular/core';
import { data } from './data';
import * as shape from 'd3-shape'
import { locale } from 'd3';
import { DatePipe } from '@angular/common';
import * as moment from 'moment'

@Component({
  selector: 'stacked-area-chart',
  styleUrls: ['./stacked-area-chart.component.scss'],
  templateUrl: './stacked-area-chart.component.html',
})
export class StackedAreaChartComponent {
  @Input() data = [];
  @Input() chartParentHeight = '200px'
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
    domain: ['#00ff00', '#d94800', '#ff006e', '#8338ec', '#3a86ff']
  };

  dateTickFormatting(val: any) {
    // var splitDate = val.toString().split(' ')
    // var splitDate1 = splitDate[0].split('-')
    // var date = splitDate1[2] + '-' + splitDate1[1] + '-' + splitDate1[0] + ' ' + splitDate[1]
    // const datepipe: DatePipe = new DatePipe('en-US');
    // let yourDate: Date = new Date(date + ' UTC');
    // return (datepipe.transform(yourDate, 'shortTime').toString())

    var date = moment.utc(val, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
    var stillUtc = moment.utc(date,'DD-MM-YYYY HH:mm');
    var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('hh:mm A');
    return local.toString()
  }

  constructor() {
    this.data = data
  }

  onSelect(event) {
  }
}


