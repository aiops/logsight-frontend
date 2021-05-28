import {Component, Input, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'line-chart',
  styleUrls: ['./line-chart.component.scss'],
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent implements OnInit {
  @Input() data = [];

  legend: boolean = true;
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
    console.log(this.data[0].series)
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
    var splitDate = val.toString().split(' ')
    var splitDate1 = splitDate[0].split('-')
    var date = splitDate1[2]+'-'+splitDate1[1]+'-'+splitDate1[0]+' '+splitDate[1].split('.')[0]
    const datepipe: DatePipe = new DatePipe('en-US');
    let yourDate: Date = new Date(date + ' UTC');
    return (datepipe.transform(yourDate, 'mediumTime').toString())
    }else{
      return val
    }
    // return splitDate
  }

}
