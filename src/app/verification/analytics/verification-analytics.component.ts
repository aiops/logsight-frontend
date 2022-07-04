import {Component, OnInit} from '@angular/core';
import {Severity} from '../models/severity.enum';
import {VerificationService} from '../services/verification.service';
import {ActivatedRoute} from "@angular/router";
import {IssuesKPIVerificationRequest} from "../../@core/common/verification-request";
import {TagRequest, TagValueRequest} from "../../@core/common/TagRequest";
import {TagEntry} from "../../@core/common/TagEntry";
import {Tag} from "../../@core/common/tags";
import {Status} from "../models/status.enum";
import {ChartRequest} from "../../@core/common/chart-request";
import {ChartConfig} from "../../@core/common/chart-config";
import * as moment from 'moment';
import {ApiService} from "../../@core/service/api.service";
import { DropdownOption } from '../models/dropdown-option.model';
import { ChartConfigParameters, ChartFeatures } from '../models/chart-config-parameters.model';
@Component({
  selector: 'verification-analytics',
  templateUrl: './verification-analytics.component.html',
  styleUrls: ['./verification-analytics.component.scss']
})
export class VerificationAnalyticsComponent implements OnInit {

  userId = ""


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


  riskBarData = []
  colorBar = {
    domain: ['#005f9d', '#007bd0', '#0090f5']
  };
  meanRisk = 0
  minRisk = 0
  maxRisk = 0


  issuesRaised = 0
  issuesAssigned = 0
  issuesSolved = 0
  totalIssues = 0

  verificationFrequencyBarData = []
  verificationFrequencyAverage = 0
  verificationFrequencyCount = 0
  verificationFrequencyWeek = 0

  verificationVelocityMinValue = 999
  verificationVelocityMaxValue = 0
  verificationVelocityMeanValue = 0
  verificationVelocityBarData = []

  verificationFailureRatioMaxValue = 0
  verificationFailureRatioWeek = 0
  verificationFailureRatioBarData = []
  verificationFailureRatioMeanValue = 0


  severityOptions: DropdownOption[] = [
    {value: Severity.Low, label: Severity[Severity.Low]}, 
    {value: Severity.Medium, label: Severity[Severity.Medium]}, 
    {value: Severity.High, label: Severity[Severity.High]}
  ];


  constructor(private verificationService: VerificationService, private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.loadAvailableTagKeys(new TagRequest([], "*_verifications"))
  }

  loadAnalytics() {
    if (this.baselineTagMap.size > 0) {
      this.loadIssuesKPI()
      this.loadBarChartData()
    } else {
      this.apiService.handleNotification("Please select tag name and value!")
    }

  }

  loadIssuesKPI() {
    const convBaselineMap = {};
    this.baselineTagMap.forEach((val: string, key: string) => {
      convBaselineMap[key] = val;
    });
    this.verificationService.loadIssuesKPI(this.userId, new IssuesKPIVerificationRequest(convBaselineMap)).subscribe(resp => {
      this.compareStatusCounts = resp.listIssueKPIs
      if (this.compareStatusCounts[Status.Raised]) {
        this.issuesRaised = this.compareStatusCounts[Status.Raised]
      }
      if (this.compareStatusCounts[Status.Assigned]) {
        this.issuesAssigned = this.compareStatusCounts[Status.Assigned]
      }
      if (this.compareStatusCounts[Status.Resolved]) {
        this.issuesSolved = this.compareStatusCounts[Status.Resolved]
      }

    });
  }

  loadBarChartData() {
    const convBaselineMap = {};
    this.baselineTagMap.forEach((val: string, key: string) => {
      convBaselineMap[key] = val;
    });

    // Refactoring: move this to a class so it takes only one row to create the object.
    // Index type can be an enum or constants.
    let parametersRisk = new ChartConfigParameters(ChartFeatures.Risk, convBaselineMap);
    let chartRequestRisk = new ChartRequest(new ChartConfig(parametersRisk), null)
    this.verificationService.loadBarData(this.userId, chartRequestRisk).subscribe(data => {
      this.meanRisk = 0
      this.maxRisk = 0
      this.minRisk = 0

      let series = data.flatMap(item => item.series).filter(current => Number(current.value) != 0);
      series.forEach(current => {
        if (current.name === 'Mean risk') this.meanRisk += Number(current.value);
        else if (current.name === 'Max risk') this.maxRisk += Number(current.value);
        else if (current.name === 'Min risk') this.minRisk += Number(current.value);
      });

      let count = series.length;
      this.meanRisk /= count / 3;
      this.maxRisk /= count / 3;
      this.minRisk /= count / 3;
      this.riskBarData = data;
    });

    let parametersVerificationFrequency = new ChartConfigParameters(ChartFeatures.Frequency, convBaselineMap);
    let chartRequestVerificationFrequency = new ChartRequest(new ChartConfig(parametersVerificationFrequency), null)
    this.verificationService.loadBarData(this.userId, chartRequestVerificationFrequency).subscribe(data => {
      this.verificationFrequencyAverage = 0
      this.verificationFrequencyWeek = 0
      this.verificationFrequencyCount = 0

      let series = data
        .flatMap(item => item.series)
        .filter(current => current.name === 'Count' && Number(current.value) != 0);
      series.forEach(current => {
          this.verificationFrequencyCount += current.value;
          this.verificationFrequencyWeek = current.value;
      });

      this.verificationFrequencyAverage = this.verificationFrequencyCount / series.length;
      this.verificationFrequencyBarData = data;
    });

    let parametersVerificationVelocity = new ChartConfigParameters(ChartFeatures.Velocity, convBaselineMap);

    // Refactoring: Create a mapper which returns data.data.data 
    // For each element convert the name (date) into a proper date format
    let chartRequestVerificationVelocity = new ChartRequest(new ChartConfig(parametersVerificationVelocity), null)
    this.verificationService.loadBarData(this.userId, chartRequestVerificationVelocity).subscribe(data => {
      
      let series = data
        .flatMap(item => item.series)
        .filter(item => item.value != 0 && item.name === 'Velocity');
      let sum = series.reduce((previous, current) => previous + current, 0);

      this.verificationVelocityMeanValue = sum / series.length;
      this.verificationVelocityBarData = data;
    });

    let parametersVerificationVelocityMinMax = new ChartConfigParameters(ChartFeatures.VelocityMinMax, convBaselineMap);
    let chartRequestVerificationVelocityMinMax = new ChartRequest(new ChartConfig(parametersVerificationVelocityMinMax), null)
    this.verificationService.loadBarData(this.userId, chartRequestVerificationVelocityMinMax).subscribe(data => {
      this.verificationVelocityMinValue = 9999
      this.verificationVelocityMaxValue = 0

      data
        .flatMap(item => item.series)
        .forEach(current => {
          if (current.name === 'Min velocity' && this.verificationVelocityMinValue > current.value) 
            this.verificationVelocityMinValue = current.value;
          else if (current.name === 'Max velocity' && this.verificationVelocityMaxValue < current.value) 
            this.verificationVelocityMaxValue = current.value;
        });
    });

    let parametersVerificationFailureRatio = new ChartConfigParameters(ChartFeatures.FailureRatio, convBaselineMap);
    let chartRequestVerificationFailureRatio = new ChartRequest(new ChartConfig(parametersVerificationFailureRatio), null)
    this.verificationService.loadBarData(this.userId, chartRequestVerificationFailureRatio).subscribe(data => {
      this.verificationFailureRatioMaxValue = 0
      this.verificationFailureRatioMeanValue = 0

      let series = data
        .flatMap(item => item.series)
        .filter(item => item.name === 'Failure ratio' && item.value != 0);

      series.forEach(current => {
        this.verificationFailureRatioWeek = current.value;
        this.verificationFailureRatioMeanValue += current.value;
        if (this.verificationVelocityMaxValue < current.value) 
          this.verificationVelocityMaxValue = current.value;
      });
      
      this.verificationFailureRatioBarData = data;
      if (this.verificationFailureRatioMeanValue != 0)
        this.verificationFailureRatioMeanValue /= series.length;
      else
        this.verificationFailureRatioMeanValue = 0;
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
    let baselineTagList = []
    for (let tagK of this.baselineTagMap.keys()) {
      baselineTagList.push(new TagEntry(tagK, this.baselineTagMap.get(tagK)))
    }
    this.verificationService.loadTagValueForKey(new TagValueRequest(tagKey, "*_verifications", baselineTagList)).subscribe(resp => {
      this.baselineTagValues = resp.tagValues
    })
  }

  baselineTagValueSelected(event) {
    this.baselineTagId = event.value
  }

  setBaselineTagKeyValue() {
    this.baselineTagValues = []
    if (this.baselineTagKey && this.baselineTagId) {
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
    } else {
      this.apiService.handleNotification("Please select tag name and value!")
    }

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
