import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VerificationOverviewComponent} from "./overview/verification-overview.component";

@Component({
  selector: 'ngx-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  constructor() { }
  insightsTabIndex = 2
  activeIndex = 0
  isVerificationCreated = false
  @ViewChild(VerificationOverviewComponent) overviewComponent;
  ngOnInit(): void {
  }

  onTabIndexChange(index){
    this.activeIndex = index
  }

  onVerificationCreated(){
    this.isVerificationCreated = true
    console.log(this.isVerificationCreated)
  }

}
