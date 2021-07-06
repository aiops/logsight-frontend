import { Component, Input } from '@angular/core';
import { data } from './data';
import Any = jasmine.Any;

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
    domain: ['#00ff00', '#d94800', '#ff006e', '#8338ec', '#3a86ff']
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

  tooltipFormatter(val: Any){
    return val
  }
}
