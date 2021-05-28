import {Component, Input, OnInit} from '@angular/core';
import { data } from './data';
import {DatePipe} from "@angular/common";
@Component({
  selector: 'grouped-vertical-bar-chart',
  styleUrls: ['./grouped-vertical-bar-chart.component.scss'],
  templateUrl: './grouped-vertical-bar-chart.component.html',
})
export class GroupedVerticalBarChartComponent{
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
  xTicks = []
  colorScheme = {
    domain: ['#ffe700', '#7fd900', '#03ffa6', '#37bdfc',
      '#3a86ff', '#035eff', '#1900ff', '#8900ff',
      '#c000ff', '#ff00c8', '#ff009d', '#ff0059',
      '#ff001f', '#840000', '#6d0000']
  };

  constructor() {
    this.data = data
  }

  // ngOnInit(): void {
  //   var xTicksLen = this.data.length
  //   var step = xTicksLen / 5
  //   console.log(step)
  //   for (let i = 0; i < xTicksLen; i++) {
  //     if (i % step != 0){
  //       this.xTicks.push('')
  //     }else {
  //       var pointName = this.data[i]
  //       console.log("Pointname", pointName)
  //       this.xTicks.push(pointName.name)
  //     }
  //   }
  // }


  // dateTickFormatting(val: any) {
  //   console.log("VAL:", val)
  //   const datepipe: DatePipe = new DatePipe('en-US');
  //   let yourDate: Date = new Date(val + ' UTC-1');
  //   return (datepipe.transform(yourDate, 'mediumTime').toString())
  // }


}
