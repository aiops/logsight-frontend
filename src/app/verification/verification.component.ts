import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {OverviewComponent} from "./overview/overview.component";

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
  @ViewChild(OverviewComponent) overviewComponent;
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
