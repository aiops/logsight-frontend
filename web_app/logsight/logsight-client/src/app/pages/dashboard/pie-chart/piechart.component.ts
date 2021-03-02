import { Component, Input } from '@angular/core';
import { data } from './data';

@Component({
  selector: 'piechart',
  styleUrls: ['./piechart.component.scss'],
  templateUrl: './piechart.component.html',
})
export class PiechartComponent {
  @Input() data = [];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#fff000', '#e85d04', '#393bff', '#00e1ff']
  };

  constructor() {
    this.data = data
  }

  onSelect(data): void {
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }
}
