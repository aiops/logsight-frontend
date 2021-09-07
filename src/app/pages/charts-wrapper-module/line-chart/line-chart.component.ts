import {Component, Input, OnInit} from '@angular/core';
import * as moment from "moment";

@Component({
  selector: 'line-chart',
  styleUrls: ['./line-chart.component.scss'],
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent implements OnInit {
  @Input() data = [];
  @Input() legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;
  counter = 0;
  xTicks = []

  colorScheme = {
    domain: ['#f0ff00', '#d94800', '#ff006e', '#8338ec', '#3a86ff']
  };

  constructor() {
  }


  ngOnInit(): void {
    var xTicksLen = this.data[0].series.length
    var step = xTicksLen / 5
    for (let i = step; i < xTicksLen; i++) {
      if (i % step != 0){
        this.xTicks.push('')
      }else {
        var pointName = this.data[0].series[i].name
        this.xTicks.push(pointName)
      }
    }
  }

  dateTickFormatting(val: any) {
    if (val.length > 0){
      var date = moment.utc(val, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
      var stillUtc = moment.utc(date,'DD-MM-YYYY HH:mm');
      var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('hh:mm:ss A');
      return local.toString()
    }else{
      return val
    }
    // return splitDate
  }

}
