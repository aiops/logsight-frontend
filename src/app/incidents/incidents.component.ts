import {Component, OnInit, ViewChild} from '@angular/core';
import {IncidentsOverviewComponent} from "./overview/incidents-overview.component";

@Component({
  selector: 'ngx-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent implements OnInit {
  constructor() {
  }

  insightsTabIndex = 1
  activeIndex = 0
  isVerificationCreated = false
  @ViewChild(IncidentsOverviewComponent) overviewComponent;

  ngOnInit(): void {
  }

  onTabIndexChange(index) {
    this.activeIndex = index
  }

  onVerificationCreated() {
    this.isVerificationCreated = true
  }

}
