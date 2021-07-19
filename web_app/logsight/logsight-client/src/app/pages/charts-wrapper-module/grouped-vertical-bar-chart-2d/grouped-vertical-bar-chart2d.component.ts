import { Component, Input } from '@angular/core';
import { data } from './data';
import * as moment from "moment";
@Component({
  selector: 'grouped-vertical-bar-chart-2d',
  styleUrls: ['./grouped-vertical-bar-chart2d.component.scss'],
  templateUrl: './grouped-vertical-bar-chart2d.component.html',
})
export class GroupedVerticalBarChart2dComponent {
  @Input() data = [];

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
    domain: ['#00ff00', '#d94800', '#ff006e', '#8338ec', '#3a86ff']
  };

  constructor() {
    this.data = data
  }

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


}
