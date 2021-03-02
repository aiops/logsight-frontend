import { Component, Input } from '@angular/core';
import { multi } from './data';

@Component({
  selector: 'chart-heatmap',
  styleUrls: ['./heatmap.component.scss'],
  templateUrl: './heatmap.component.html',
})
export class HeatmapComponent {
  @Input() data = [];

  legend: boolean = true;
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
      '#d3e7c2',
      '#b4d596',
      '#9fc97c',
      '#96c271',
      '#8cbc67',
      '#DAA520',
      '#FFA500',
      '#ff631f',
    ]
  };

  constructor() {
    this.data = multi
  }

  onSelect(data): void {
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }
}
