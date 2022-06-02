import {Component, OnInit, ViewChild} from '@angular/core';
import {VerificationOverviewComponent} from "./overview/verification-overview.component";

@Component({
  selector: 'ngx-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  constructor() {
  }

  insightsTabIndex = 1
  activeIndex = 0
  isVerificationCreated = false
  @ViewChild(VerificationOverviewComponent) overviewComponent;

  ngOnInit(): void {
  }

  onTabIndexChange(index) {
    this.activeIndex = index
  }

  onVerificationCreated() {
    this.isVerificationCreated = true
  }

}
