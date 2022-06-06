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


  severityOptions: DropdownOption[] = [{value: Severity.Low, label: Severity[Severity.Low]}, {
    value: Severity.Medium, label: Severity[Severity.Medium]
  }, {value: Severity.High, label: Severity[Severity.High]}];


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
    let parametersRisk = {
      "type": "barchart",
      "feature": "compare_analytics_risk",
      "indexType": "verifications",
      "baselineTags": convBaselineMap
    }
    let chartRequestRisk = new ChartRequest(new ChartConfig(parametersRisk), null)
    this.verificationService.loadBarData(this.userId, chartRequestRisk).subscribe(data => {
      data = data.data.data
      let count = 0
      this.meanRisk = 0
      this.maxRisk = 0
      this.minRisk = 0
      if (data) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].series.length; j++) {
            if (data[i].series[j].name == "Min risk" && data[i].series[j].value != 0) {
              this.minRisk += Number(data[i].series[j].value)
            } else if (data[i].series[j].name == "Max risk" && data[i].series[j].value != 0) {
              this.maxRisk += Number(data[i].series[j].value)
            } else if (data[i].series[j].name == "Mean risk" && data[i].series[j].value != 0) {
              this.meanRisk += Number(data[i].series[j].value)
            }
            if (data[i].series[j].value != 0) {
              count += 1
            }
          }
          var date = moment.utc(data[i].name, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
          var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
          var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
          data[i].name = local.toString()
        }
        this.meanRisk = this.meanRisk / (count / 3)
        this.maxRisk = this.maxRisk / (count / 3)
        this.minRisk = this.minRisk / (count / 3)
        this.riskBarData = data;
      }
    });
    let parametersVerificationFrequency = {
      "type": "barchart",
      "feature": "compare_analytics_verification_frequency",
      "indexType": "verifications",
      "baselineTags": convBaselineMap
    }
    let chartRequestVerificationFrequency = new ChartRequest(new ChartConfig(parametersVerificationFrequency), null)
    this.verificationService.loadBarData(this.userId, chartRequestVerificationFrequency).subscribe(data => {
      data = data.data.data
      let count = 0
      this.verificationFrequencyAverage = 0
      this.verificationFrequencyWeek = 0
      this.verificationFrequencyAverage = 0
      this.verificationFrequencyCount = 0
      if (data) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].series.length; j++) {
            if (data[i].series[j].name == "Count" && data[i].series[j].value != 0) {
              this.verificationFrequencyAverage += Number(data[i].series[j].value)
              this.verificationFrequencyCount += Number(data[i].series[j].value)
              count += 1
              this.verificationFrequencyWeek = Number(data[i].series[j].value)
            }
          }
          var date = moment.utc(data[i].name, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
          var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
          var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
          data[i].name = local.toString()
        }
        this.verificationFrequencyAverage = this.verificationFrequencyAverage / count
        this.verificationFrequencyBarData = data;
      }
    });

    let parametersVerificationVelocity = {
      "type": "barchart",
      "feature": "compare_analytics_verification_velocity",
      "indexType": "verifications",
      "baselineTags": convBaselineMap
    }
    let chartRequestVerificationVelocity = new ChartRequest(new ChartConfig(parametersVerificationVelocity), null)
    this.verificationService.loadBarData(this.userId, chartRequestVerificationVelocity).subscribe(data => {
      data = data.data.data
      if (data) {
        let count = 0
        this.verificationVelocityMeanValue = 0
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].series.length; j++) {
            if (data[i].series[j].name == "Velocity" && data[i].series[j].value != 0) {
              this.verificationVelocityMeanValue += data[i].series[j].value
              count += 1
            }
          }
          var date = moment.utc(data[i].name, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
          var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
          var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
          data[i].name = local.toString()
        }
        this.verificationVelocityMeanValue = this.verificationVelocityMeanValue / count
        this.verificationVelocityBarData = data;
      }
    });

    let parametersVerificationVelocityMinMax = {
      "type": "barchart",
      "feature": "compare_analytics_verification_velocity_min_max",
      "indexType": "verifications",
      "baselineTags": convBaselineMap
    }
    let chartRequestVerificationVelocityMinMax = new ChartRequest(new ChartConfig(parametersVerificationVelocityMinMax), null)
    this.verificationService.loadBarData(this.userId, chartRequestVerificationVelocityMinMax).subscribe(data => {
      data = data.data.data
      let count = 0
      let minValue = 9999
      let maxValue = 0
      this.verificationVelocityMinValue = 0
      this.verificationVelocityMaxValue = 0
      if (data) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].series.length; j++) {
            if (data[i].series[j].name == "Min velocity" && data[i].series[j].value != 0) {
              if (minValue > data[i].series[j].value) {
                minValue = data[i].series[j].value
              }
            }
            if (data[i].series[j].name == "Max velocity" && data[i].series[j].value != 0) {
              if (maxValue < data[i].series[j].value) {
                maxValue = data[i].series[j].value
              }
            }
          }
        }
        this.verificationVelocityMinValue = minValue
        this.verificationVelocityMaxValue = maxValue
      }
    });

    let parametersVerificationFailureRatio = {
      "type": "barchart",
      "feature": "compare_analytics_verification_failure_ratio",
      "indexType": "verifications",
      "baselineTags": convBaselineMap
    }
    let chartRequestVerificationFailureRatio = new ChartRequest(new ChartConfig(parametersVerificationFailureRatio), null)
    this.verificationService.loadBarData(this.userId, chartRequestVerificationFailureRatio).subscribe(data => {
      data = data.data.data
      let count = 0
      this.verificationFailureRatioMaxValue = 0
      this.verificationFailureRatioMeanValue = 0
      if (data) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].series.length; j++) {
            if (data[i].series[j].name == "Failure ratio" && data[i].series[j].value != 0) {
              this.verificationFailureRatioWeek = data[i].series[j].value
              this.verificationFailureRatioMeanValue += data[i].series[j].value
              count += 1
              if (this.verificationFailureRatioMaxValue < data[i].series[j].value) {
                this.verificationFailureRatioMaxValue = data[i].series[j].value
              }
            }
          }
          var date = moment.utc(data[i].name, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
          var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
          var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
          data[i].name = local.toString()

        }
        this.verificationFailureRatioBarData = data
        if (this.verificationFailureRatioMeanValue == 0) {
          this.verificationFailureRatioMeanValue = 0
        } else {
          this.verificationFailureRatioMeanValue = this.verificationFailureRatioMeanValue / count
        }
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
