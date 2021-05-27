import { Component, EventEmitter, Input, Output } from '@angular/core';
import { multi } from './data';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'chart-heatmap',
  styleUrls: ['./heatmap.component.scss'],
  templateUrl: './heatmap.component.html',
})
export class HeatmapComponent {
  @Input() data = [];
  @Output() select = new EventEmitter();

  legend: boolean = false;
  showLabels: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Country';
  yAxisLabel: string = 'Year';
  fill: boolean = true;

  colorScheme = {
    domain: [
      'rgb(0,255,0)',
      '#ffb908',
      '#fa8507',
      '#f47506',
      '#e86704',
      '#dc2f02',
      '#D00000',
    ]
  };

  constructor() {
    this.data = multi
  }

  dateTickFormatting(val: any) {
    var splitDate = val.toString().split(' ')
    var splitDate1 = splitDate[0].split('-')
    var date = splitDate1[2]+'-'+splitDate1[1]+'-'+splitDate1[0]+' '+splitDate[1]
    const datepipe: DatePipe = new DatePipe('en-US');
    let yourDate: Date = new Date(date + ' UTC');
    return (datepipe.transform(yourDate, 'shortTime').toString())
  }


  onSelect(data): void {
    console.log('onSelect', data)
  }
}
