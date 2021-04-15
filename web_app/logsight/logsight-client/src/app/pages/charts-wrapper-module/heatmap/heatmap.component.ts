import { Component, EventEmitter, Input, Output } from '@angular/core';
import { multi } from './data';

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
      '#f0ff00',
      '#ffba08',
      '#faa307',
      '#f48c06',
      '#e85d04',
      '#dc2f02',
      '#D00000',
    ]
  };

  constructor() {
    this.data = multi
  }

  onSelect(data): void {
    console.log('onSelect', data)
  }
}
