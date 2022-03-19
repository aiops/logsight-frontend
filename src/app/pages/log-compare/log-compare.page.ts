import {Component, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LogCompareService} from './log-compare.service';
import {options} from './chart-options';
import 'd3';
import 'nvd3';
import {Observable, Subject} from 'rxjs';
import {VariableAnalysisService} from '../../@core/service/variable-analysis.service';
import {MessagingService} from '../../@core/service/messaging.service';
import {NotificationsService} from 'angular2-notifications';
import {NbDialogService, NbPopoverDirective} from '@nebular/theme';
import * as moment from 'moment'
import {Moment} from 'moment'
import {switchMap} from 'rxjs/operators';
import {DashboardService} from '../dashboard/dashboard.service';
import {Application} from '../../@core/common/application';
import {AuthenticationService} from '../../auth/authentication.service';
import {IntegrationService} from '../../@core/service/integration.service';
import {PredefinedTime} from "../../@core/common/predefined-time";
import {VerificationData} from "../../@core/common/verification-data";
import * as $ from 'jquery';
import 'jquery-sparkline'
import {LogsightUser} from "../../@core/common/logsight-user";
import {ApiService} from "../../@core/service/api.service";
import {ChartRequest} from "../../@core/common/chart-request";
import {ChartConfig} from "../../@core/common/chart-config";
import {VerificationRequest} from "../../@core/common/verification-request";
import {Tags} from "../../@core/common/tags";

@Component({
  selector: 'compare',
  styleUrls: ['./log-compare.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './log-compare.page.html',
  encapsulation: ViewEncapsulation.None

})

export class LogComparePage {

  options = options.timelineChart()
  @ViewChild('dateTimePicker', {read: TemplateRef}) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  openDatePicker = false;
  applicationId: string = null;
  applications: Application[] = [];

  userId: string;
  user: LogsightUser | null;

  tags: Tags[] = [];
  baselineTagId: string;
  matchPercentage = 0.0
  logBarFirst = []
  logBarSecond = []
  barData = []
  barData$: Observable<any>;
  heatmapData = []
  isSpinning = false
  heatmapData$: Observable<any>;
  colorSchemeFirst = {
    domain: ['#22c08f']
  };
  colorSchemeSecond = {
    domain: ['#8bb4ff']
  };

  selectedRadioOption: number = 525600

  compareTagId: string;
  heatmapHeightList = [];
  unique = [];
  startDateTime = 'now-525600m';
  endDateTime = 'now'
  heatmapHeight = '200px';
  horizontalHeight = '300px';
  barDataFirst$: Observable<any>;
  barDataFirst = []
  barDataSecond$: Observable<any>;
  barDataSecond = []
  newTemplatesBarData = []
  horizontalData = []
  tableData = []
  horizontalData$: Observable<any>;
  newTemplatesBarData$: Observable<any>;
  tableDataUnified: VerificationData = {
    "risk": "0",
    "risk_color": "red",
    "total_n_log_messages": "0",
    "count_baseline": "0",
    "count_candidate": "0",
    "candidate_perc": "0",
    "added_states": "0",
    "added_states_info": "0",
    "added_states_fault": "0",
    "deleted_states": "0",
    "deleted_states_info": "0",
    "deleted_states_fault": "0",
    "recurring_states": "0",
    "recurring_states_info": "0",
    "recurring_states_fault": "0",
    "frequency_change_threshold": "0",
    "frequency_change": "0",
    "frequency_change_info": "0",
    "frequency_change_fault": "0",
    "cols": [],
    "rows": []
  }

  predefinedTimes: PredefinedTime[] = [];
  countAnomalies = []
  newTemplates = []
  private stopPolling = new Subject();
  reload$: Subject<boolean> = new Subject();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private logCompareService: LogCompareService,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService,
              private dashboardService: DashboardService,
              private authService: AuthenticationService,
              private integrationService: IntegrationService,
              private router: Router,
              private apiService: ApiService) {

  }


  ngOnInit(): void {
    this.userId = localStorage.getItem("userId")
    this.loadPredefinedTimes();
    this.route.queryParamMap.subscribe(queryParams => {
      this.applicationId = queryParams.get('applicationId')
      this.baselineTagId = queryParams.get('baselineTag')
      this.compareTagId = queryParams.get('compareTag')
      if (this.applicationId && this.baselineTagId && this.compareTagId) {
        setTimeout(_ => this.computeLogCompare(), 100);
        this.computeLogCompare()
      } else {
        this.authService.getLoggedUser(this.userId).pipe(
          switchMap(user => this.integrationService.loadApplications(this.userId))
        ).subscribe(resp => {
          this.applications = resp.applications
        })
      }
    });

  }

  loadBarDataUnified() {

    let type = 'barchart'
    let feature = 'system_overview'
    let indexType = 'log_ad'
    let chartRequest = new ChartRequest(new ChartConfig(type, this.startDateTime, this.endDateTime, feature, indexType, ""), this.applicationId)

    this.logCompareService.loadBarData(this.userId, chartRequest).subscribe(data => {
      data = data.data.data
      if (data) {
        for (let i = 0; i < data.length; i++) {
          var date = moment.utc(data[i].name, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
          var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
          var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
          data[i].name = local.toString()
        }
        this.barData = data;
      }
    }, error => {
      this.apiService.handleErrors(error)
    })
  }


  radioChange(event) {
    this.selectedRadioOption = event
  }

  computeLogCompare() {
    this.isSpinning = true
    let verificationRequest = new VerificationRequest(this.applicationId, this.userId, this.baselineTagId, this.compareTagId)
    this.logCompareService.computeLogCompare(verificationRequest).subscribe(resp => {
      this.tableDataUnified = resp
      // console.log("data:", this.tableDataUnified)
      this.isSpinning = false
      setTimeout(_ => {
        $('.inlinesparkline').sparkline('html', {width: '6vh', height: '1.8vh'});
        $('.barsparkline').sparkline('html', {type: 'bar'});
        $('.dualsparkline').sparkline('html', {
          type: 'bar',
          barColor: 'blue',
          tagValuesAttribute: 'barvalues',
          width: '60px',
          barWidth: "7"
        });
        $('.dualsparkline').sparkline('html', {
          type: 'line',
          lineColor: 'red',
          fillColor: false,
          tagValuesAttribute: 'linevalues',
          width: '60px',
          composite: true,
        });
      }, 50); //hack to start first refresh

    }, error => {
      this.apiService.handleErrors(error)
      this.isSpinning = false
    })
    this.loadBarDataUnified()
  }

  toLocalTime(data) {
    for (let i = 0; i < data.length; i++) {
      var date = moment.utc(data[i].timestamp, 'DD-MM-YYYY HH:mm:ss.SSS').format('DD-MM-YYYY HH:mm:ss.SSS');
      var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm:ss.SSS');
      var local = moment(stillUtc, 'DD-MM-YYYY HH:mm:ss.SSS').local().format('DD-MM-YYYY HH:mm:ss.SSS');
      data[i].timestamp = local.toString()
    }
    return data
  }

  onDateTimeSearch(event) {
    this.popover.hide();
    this.openDatePicker = false;
    let dateTimeType = 'absolute';
    if (event.relativeTimeChecked) {
      dateTimeType = 'relative'
      this.startDateTime = event.relativeDateTime
      this.endDateTime = 'now'
      // this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
      // this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = event.absoluteDateTime.startDateTime
      this.endDateTime = event.absoluteDateTime.endDateTime
      // this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
      // this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
    }
    this.loadBarDataUnified()
    // this.reload$.next()
    // this.router.navigate([],
    //   { queryParams: { startTime: this.startDateTime, endTime: this.endDateTime, dateTimeType } })
  }

  openPopover() {
    this.popover.show();
    this.openDatePicker = !this.openDatePicker
    if (!this.openDatePicker) {
      this.popover.hide();
    }
  }

  //
  // filterApplicationsWithVersions() {
  //   // this.loadApplicationVersions(this.applications[0].id)
  //   for (let i = 0; i < this.applications.length; i++) {
  //     let tags = this.loadApplicationVersions(this.userId, this.applications[i].applicationId)
  //   }
  //
  // }

  applicationSelected(appId: string) {
    this.applicationId = appId;
    setTimeout(_ => {
      this.loadApplicationVersions(this.userId, this.applicationId);
    }, 1);
  }

  baselineTagSelected(tagId: string) {
    this.baselineTagId = tagId;
    this.reload$.next()
  }

  compareTagSelected(tagId: string) {
    this.compareTagId = tagId;
    this.loadBarDataUnified()
    this.reload$.next()
  }

  //
  // private loadLogCompareData(userId: string, startTime: string, endTime: string, applicationId: string, baselineTagId: string, compareTagId: string) {
  //   this.tableData = []
  //   this.countAnomalies = []
  //   this.newTemplates = []
  //   this.matchPercentage = 0.0
  //   this.logCompareService.loadLogCompareData(this.userId, startTime, endTime, applicationId, baselineTagId, compareTagId).subscribe(data => {
  //     this.tableData = data
  //     let countAnomaliesMap = new Map<string, string>();
  //     let newTemplatesMap = new Map<string, string>();
  //     for (let i = 0; i < data.length; i++) {
  //       this.matchPercentage += data[i].ratioScore
  //       for (let j = 0; j < data[i].countAnomalyList.length; j++) {
  //         if (countAnomaliesMap.has(data[i].countAnomalyList[j].template)) {
  //           if (!(countAnomaliesMap.get(data[i].countAnomalyList[j].template) == data[i].countAnomalyList[j].timestamp)) {
  //             this.countAnomalies.push(data[i].countAnomalyList[j])
  //             countAnomaliesMap.set(data[i].countAnomalyList[j].template, data[i].countAnomalyList[j].timestamp);
  //           }
  //         } else {
  //           this.countAnomalies.push(data[i].countAnomalyList[j])
  //           countAnomaliesMap.set(data[i].countAnomalyList[j].template, data[i].countAnomalyList[j].timestamp);
  //         }
  //       }
  //       for (let k = 0; k < data[i].newTemplateList.length; k++) {
  //         if (!newTemplatesMap.has(data[i].newTemplateList[k].template)) {
  //           if (!(newTemplatesMap.get(data[i].newTemplateList[k].template) == data[i].newTemplateList[k].timestamp)) {
  //             this.newTemplates.push(data[i].newTemplateList[k])
  //             newTemplatesMap.set(data[i].newTemplateList[k].template, data[i].newTemplateList[k].timestamp);
  //           }
  //         }
  //       }
  //     }
  //     this.matchPercentage = this.matchPercentage * 100 / data.length
  //     this.matchPercentage = round(this.matchPercentage * 100) / 100
  //     this.countAnomalies = this.toLocalTime(this.countAnomalies)
  //
  //     this.newTemplates = this.toLocalTime(this.newTemplates)
  //
  //   })
  //
  // }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  private loadApplicationVersions(userId: string, applicationId: string) {
    this.logCompareService.loadApplicationVersions(userId, applicationId).subscribe(resp => {
        this.tags = resp
        for (let i = 0; i < this.tags.length; i++) {
          if (this.tags[i].tagView.length > 7) {
            this.tags[i].tagView = this.tags[i].tagView.slice(0, 8)
          }
        }
        if (resp.length > 1) {
          this.baselineTagId = this.tags[0].tag
          this.compareTagId = this.tags[1].tag
        } else {
          this.baselineTagId = this.tags[0].tag
          this.compareTagId = this.tags[0].tag
        }
      },
      error => {
        this.apiService.handleErrors(error)
      })
  }

  private getTimeDiff() {
    let timeList = []
    let indx = []
    for (let i = 0; i < this.heatmapData.length; i++) {
      if (this.heatmapData[i].series.length) {
        indx.push(i)
        timeList.push(this.heatmapData[i].series[0].extra)
      }
    }
    let date = timeList[0].split(' ')[0].split('-');
    let time = timeList[0].split(' ')[1].split(':');
    const firstTime: Moment = moment().year(+date[2]).month(+date[1] - 1).date(+date[0]).hour(+time[0]).minute(
      +time[1]);
    date = timeList[1].split(' ')[0].split('-');
    time = timeList[1].split(' ')[1].split(':');
    const secondTime: Moment = moment().year(+date[2]).month(+date[1] - 1).date(+date[0]).hour(+time[0]).minute(
      +time[1]);
    return (secondTime.diff(firstTime, "minutes") / indx[1] - indx[0])

  }

  loadPredefinedTimes() {
    this.dashboardService.getAllTimeRanges(this.userId).subscribe(resp => {
      this.predefinedTimes = resp.timeSelectionList
    })
  }

  onDeletePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.deleteTimeRange(this.userId, predefinedTime).subscribe(() => this.loadPredefinedTimes())
  }

  onSavePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.createTimeRange(this.userId, predefinedTime).subscribe(resp => this.loadPredefinedTimes())
  }

  onSelectPredefinedTime(pt: PredefinedTime) {
    if (pt.dateTimeType == 'RELATIVE') {
      this.onDateTimeSearch({relativeTimeChecked: true, relativeDateTime: pt.startTime})
    } else {
      this.onDateTimeSearch({
        absoluteTimeChecked: true, absoluteDateTime: {
          startDateTime: pt.startTime,
          endDateTime: pt.endTime
        }
      })
    }
  }


}
