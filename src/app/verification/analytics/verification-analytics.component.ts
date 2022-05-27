import {Component, OnInit} from '@angular/core';
import {Severity} from '../models/severity.enum';
import {VerificationService} from '../services/verification.service';
import {ActivatedRoute} from "@angular/router";
import {IssuesKPIVerificationRequest} from "../../@core/common/verification-request";
import {TagRequest} from "../../@core/common/TagRequest";
import {TagEntry} from "../../@core/common/TagEntry";
import {Tag} from "../../@core/common/tags";
import {Status} from "../models/status.enum";

interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'verification-analytics',
  templateUrl: './verification-analytics.component.html',
  styleUrls: ['./verification-analytics.component.scss']
})
export class VerificationAnalyticsComponent implements OnInit {

  baselineTags: Tag[];
  baselineTagValues: Tag[];
  baselineTagId: string;
  baselineTagMap = new Map<string, string>();
  baselineTagMapKeys = [];
  baselineTagKey: string;

  candidateTags: Tag[];
  candidateTagValues: Tag[];
  candidateTagId: string;
  candidateTagMap = new Map<string, string>();
  candidateTagMapKeys = [];
  candidateTagKey: string;

  compareStatusCounts: Map<number, number>;
  isLoading = false;

  issuesRaised = 0
  issuesAssigned = 0
  issuesSolved = 0
  totalIssues = 0

  severityOptions: DropdownOption[] = [{value: Severity.Low, label: Severity[Severity.Low]}, {
    value: Severity.Medium, label: Severity[Severity.Medium]
  }, {value: Severity.High, label: Severity[Severity.High]}];


  constructor(private verificationService: VerificationService, private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.loadAvailableTagKeys(new TagRequest([]))
  }

  loadIssuesKPI() {
    const convBaselineMap = {};
    this.baselineTagMap.forEach((val: string, key: string) => {
      convBaselineMap[key] = val;
    });
    this.verificationService.loadIssuesKPI(new IssuesKPIVerificationRequest(convBaselineMap)).subscribe(resp => {
      this.compareStatusCounts = resp.listIssueKPIs
      console.log(this.compareStatusCounts[Status.Raised])
      if(this.compareStatusCounts[Status.Raised]){
        this.issuesRaised = this.compareStatusCounts[Status.Raised]
      }
      if(this.compareStatusCounts[Status.Assigned]){
        this.issuesAssigned = this.compareStatusCounts[Status.Assigned]
      }
      if(this.compareStatusCounts[Status.Resolved]){
        this.issuesSolved = this.compareStatusCounts[Status.Resolved]
      }

    });
  }


  loadAvailableTagKeys(tagRequest: TagRequest) {
    this.loadAvailableBaselineTagKeys(tagRequest)
    this.loadAvailableCandidateTagKeys(tagRequest)
  }

  baselineTagKeySelected(event) {
    this.baselineTagKey = event.value
    this.loadBaselineTagValuesForKey(this.baselineTagKey)
  }


  loadBaselineTagValuesForKey(tagKey: string) {
    this.verificationService.loadTagValueForKey(tagKey).subscribe(resp => {
      this.baselineTagValues = resp.tagValues
    })
  }

  baselineTagValueSelected(event) {
    this.baselineTagId = event.value
  }

  setBaselineTagKeyValue() {
    this.baselineTagValues = []
    this.baselineTagMap.set(this.baselineTagKey, this.baselineTagId)
    if (!this.baselineTagMapKeys.includes(this.baselineTagKey)) {
      this.baselineTagMapKeys.push(this.baselineTagKey)
    }
    let baselineTagList = []
    for (let tagK of this.baselineTagMap.keys()) {
      baselineTagList.push(new TagEntry(tagK, this.baselineTagMap.get(tagK)))
    }
    this.baselineTagKey = null
    this.baselineTagId = null
    this.loadAvailableBaselineTagKeys(new TagRequest(baselineTagList))
  }

  onBaselineTagRemove(event) {
    this.baselineTagMap.delete(event.text.split(':')[0])
    this.baselineTagMapKeys = []
    this.baselineTagMap.forEach((value, key) => {
      this.baselineTagMapKeys.push(key)
    })
    let baselineTagList = []
    for (let tagK of this.baselineTagMap.keys()) {
      baselineTagList.push(new TagEntry(tagK, this.baselineTagMap.get(tagK)))
    }
    this.loadAvailableBaselineTagKeys(new TagRequest(baselineTagList))
  }

  loadAvailableBaselineTagKeys(tagRequest: TagRequest) {
    this.verificationService.loadAvailableTagKeys(tagRequest).subscribe(resp => {
      this.baselineTags = resp.tagKeys
    })
  }

  loadCandidateTagValueForKey(tagKey: string) {
    this.verificationService.loadTagValueForKey(tagKey).subscribe(resp => {
      this.candidateTagValues = resp.tagValues
    })
  }

  candidateTagValueSelected(event) {
    this.candidateTagId = event.value
  }

  candidateTagKeySelected(event) {
    this.candidateTagKey = event.value
    this.loadCandidateTagValueForKey(this.candidateTagKey)
  }


  setCandidateTagKeyValue() {
    this.candidateTagValues = []
    this.candidateTagMap.set(this.candidateTagKey, this.candidateTagId)
    if (!this.candidateTagMapKeys.includes(this.candidateTagKey)) {
      this.candidateTagMapKeys.push(this.candidateTagKey)
    }
    let candidateTagList = []
    for (let tagK of this.candidateTagMap.keys()) {
      candidateTagList.push(new TagEntry(tagK, this.candidateTagMap.get(tagK)))
    }
    this.candidateTagKey = null
    this.candidateTagId = null
    this.loadAvailableCandidateTagKeys(new TagRequest(candidateTagList))
  }

  onCandidateTagRemove(event) {
    this.candidateTagMap.delete(event.text.split(':')[0])
    this.candidateTagMapKeys = []
    this.candidateTagMap.forEach((value, key) => {
      this.candidateTagMapKeys.push(key)
    })
    let candidateTagList = []
    for (let tagK of this.candidateTagMap.keys()) {
      candidateTagList.push(new TagEntry(tagK, this.candidateTagMap.get(tagK)))
    }
    this.loadAvailableCandidateTagKeys(new TagRequest(candidateTagList))
  }


  loadAvailableCandidateTagKeys(tagRequest: TagRequest) {
    this.verificationService.loadAvailableTagKeys(tagRequest).subscribe(resp => {
      this.candidateTags = resp.tagKeys
    })
  }

}
