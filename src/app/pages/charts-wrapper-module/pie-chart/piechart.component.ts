import { Component, Input } from '@angular/core';
import { data } from './data';
import Any = jasmine.Any;
import { dataService } from "./data.service";
import {Subscription} from "rxjs";

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
  colorSubscription: Subscription;

  colorScheme = {
    domain: ['#00ff00', '#ff0000', '#d9bc00', '#8338ec', '#3a86ff']
  };

  constructor(private colorService: dataService) {
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
  ngOnInit(){
    this.colorScheme = this.colorService.getColor()
  }
}
