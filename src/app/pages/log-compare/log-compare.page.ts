import {
  AfterViewInit,
  Component, OnDestroy,
  OnInit, TemplateRef, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LogCompareService } from './log-compare.service';
import { options } from './chart-options';
import 'd3';
import 'nvd3';
import {combineLatest, Observable, Subject, timer} from 'rxjs';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { MessagingService } from '../../@core/service/messaging.service';
import { NotificationsService } from 'angular2-notifications';
import { NbDialogService, NbPopoverDirective } from '@nebular/theme';
import * as moment from 'moment'
import {last, map, retry, share, switchMap, takeUntil} from 'rxjs/operators';
import { DashboardService } from '../dashboard/dashboard.service';
import { Application } from '../../@core/common/application';
import { AuthenticationService } from '../../auth/authentication.service';
import { IntegrationService } from '../../@core/service/integration.service';
import {LogQualityOverview} from "../../@core/common/log-quality-overview";
import {Moment} from "moment";
import {VariableAnalysisHit} from "../../@core/common/variable-analysis-hit";
import {VariableAnalysisTemplate} from "../../@core/components/app/variable-analysis-template";
import {round} from "@popperjs/core/lib/utils/math";
import {PredefinedTime} from "../../@core/common/predefined-time";
import {VerificationData} from "../../@core/common/verification-data";
import * as $ from 'jquery';
import 'jquery-sparkline'
@Component({
  selector: 'log-compare',
  styleUrls: ['./log-compare.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './log-compare.page.html',
  encapsulation: ViewEncapsulation.None

})

export class LogComparePage{

  options = options.timelineChart()
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  openDatePicker = false;
  applicationId: number;
  applications: Application[] = [];
  tags: String[] = [];
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
  tableDataUnified : VerificationData = {
  "risk": "0",
  "risk_color": "red",
  "total_n_log_messages": "0",
  "count_baseline": "0",
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
  "rows": []}

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
              private router: Router) {
    this.heatmapData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.barDataFirst$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, "", "", "")),
      share(),
      takeUntil(this.stopPolling)
    );

    this.barDataSecond$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, "", this.compareTagId, "")),
      share(),
      takeUntil(this.stopPolling)
    );

    this.newTemplatesBarData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId, "new_templates")),
      share(),
      takeUntil(this.stopPolling)
    );

    this.horizontalData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadCompareTemplatesHorizontalBar(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)),
      share(),
      takeUntil(this.stopPolling)
    );
  }


  ngOnInit(): void {

    this.loadPredefinedTimes();
    this.heatmapData$.subscribe(data => {
      for (let i = 0; i < data.data.length; i++) {
        for (let j = 0; j < data.data[i].series.length; j++) {
          data.data[i].series[j].extra = data.data[i].name
        }
        var date = moment.utc(data.data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
        data.data[i].name = local.toString()
      }

      for (let i = 0; i < data.data.length; i++) {
        for (let j = 0; j < data.data[i].series.length; j++) {
          this.heatmapHeightList.push(data.data[i].series[j].name)
        }
      }
      this.unique = Array.from(new Set(this.heatmapHeightList.map(team => team)));
      if (this.unique.length > 0) {
        if (50 * (this.unique.length + 1) < 350) {
          this.heatmapHeight = (50 * (this.unique.length + 1)).toString() + 'px'
        } else {
          this.heatmapHeight = '300px'
        }
      } else {
        this.heatmapHeight = '150px'
      }
      this.heatmapData = data.data;
    })

    this.barDataFirst$.subscribe(data => {
      if (data.length > 0){
      let firstDay = moment.utc(data[0].name, 'DD-MM-YYYY HH:mm')
      let lastDay = moment.utc(data[data.length-1].name, 'DD-MM-YYYY HH:mm')
      let daysDiff = lastDay.diff(firstDay, "days")
      for (let i = 0; i < data.length; i++) {
        var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
        var local = ""
        if (daysDiff > 0){
          local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
        }else{
          local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
        }
        data[i].name = local.toString()
      }
      this.barDataFirst = data;

            }
    })

    this.barDataSecond$.subscribe(data => {

      // let firstDay = moment.utc(data[0].name, 'DD-MM-YYYY HH:mm')
      // let lastDay = moment.utc(data[data.length-1].name, 'DD-MM-YYYY HH:mm')
      // console.log("AAAAAA:", data)
      // let daysDiff = lastDay.diff(firstDay, "days")
      // for (let i = 0; i < data.length; i++) {
      //   var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
      //   var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
      //   var local = ""
      //   console.log("AA", daysDiff)
      //   if (daysDiff > 0){
      //     local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('DD-MM-YYYY HH:mm');
      //   }else{
      //     local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('HH:mm A');
      //   }
      //   data[i].name = local.toString()
      // }

      for (let i = 0; i < data.length; i++) {
        var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
        data[i].name = local.toString()
      }
      // console.log("AA",data )
      this.barDataSecond = data;
    })

    this.newTemplatesBarData$.subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
        data[i].name = local.toString()
      }
      if (this.newTemplatesBarData.length > 0){
        if (this.isSpinning){
          this.loadLogCompareData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
        }
        this.isSpinning = false
        // this.logCountBar(this.compareTagId)
        // this.loadCompareTemplatesHorizontalBar(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
        // this.loadLogCompareData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
        // this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
        // this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId, "new_templates")
        // this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, "", this.compareTagId, "")
      }
      this.newTemplatesBarData = data;
    })

    this.horizontalData$.subscribe(data => {
      this.horizontalData = data;
      this.horizontalHeight = (60 * (this.horizontalData.length + 1)).toString() + 'px'
    })

    this.route.queryParamMap.subscribe(queryParams => {
      const startTime = queryParams.get('startTime')
      const endTime = queryParams.get('endTime')
      const applicationParam = queryParams.get('applicationId')
      const dateTimeType = queryParams.get('dateTimeType');
      this.applicationId = applicationParam ? +applicationParam : null
      if (startTime && endTime) {
        if (dateTimeType == 'absolute') {
          this.startDateTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
          this.endDateTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
        } else {
          this.startDateTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss.SSSSSS').format('YYYY-MM-DDTHH:mm:ss.SSSSSS');
          this.endDateTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss.SSSSSS').format('YYYY-MM-DDTHH:mm:ss.SSSSSS');
        }
      }
      // this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
    });

    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => {
      this.applications = resp
    //   let preloadedApp = this.applications[0];
    //   // this.applications = []
    //   for (let i=0; i < resp.length; i++){
    //     this.logCompareService.loadApplicationVersions(resp[i].id).subscribe(versions => {
    //     if (versions.length > 0){
    //       // this.applications.push(resp[i])
    //       preloadedApp = resp[i]
    //       this.applicationId = preloadedApp.id;
    //     }
    //     // this.notificationService.success("Versions loaded")
    //   }, error => {
    //     this.notificationService.error("Bad request, contact support!")
    //   })
    // }
      setTimeout(_ => {this.applicationSelected(this.applicationId);}, 50);
    })
    this.messagingService.getVariableAnalysisTemplate()
      .pipe(takeUntil(this.destroy$), map(it => it['item']))
      .subscribe(selected => {
        if (selected.applicationId) {
          this.variableAnalysisService.loadSpecificTemplate(selected.applicationId, this.startDateTime,
            this.endDateTime, selected).subscribe(
            resp => {
              this.dialogService.open(SpecificTemplateModalComponent, {
                context: {
                  data: resp.second,
                  type: resp.first
                }, dialogClass: 'model-full'
              });
            }, err => {
              this.notificationService.error('Error', 'Error fetching data')
            })
        }
      })
  }

  loadHeatmapData(startTime: string, endTime: string, applicationId: number, baselineTagId: string, compareTagId: string) {
    return this.logCompareService.loadHeatmapData(startTime, endTime, applicationId, baselineTagId, compareTagId)
  }

  loadBarDataUnified(startTime: string, endTime: string, applicationId: number) {
    this.logCompareService.loadBarData(startTime, endTime, applicationId).subscribe(data => {
      if (data){
      for (let i = 0; i < data.length; i++) {
        var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
        data[i].name = local.toString()
      }
      this.barData = data;
      // console.log("DATA", data)
    } }, error => {
      console.log(error)
    })
  }


  loadapplications(){
    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => {
      this.applications = resp
      console.log(this.applications)
      // setTimeout(_ => {this.applicationSelected(this.applicationId);}, 50);
    })
  }
  loadBarData(startDateTime, endDateTime, applicationId, baselineTagId, compareTagId, newTemplates) {
    return this.logCompareService.getCognitiveBarData(applicationId, startDateTime, endDateTime, baselineTagId, compareTagId, newTemplates);
  }

  loadCompareTemplatesHorizontalBar(startDateTime, endDateTime, applicationId, baselineTagId, compareTagId) {
    return this.logCompareService.loadCompareTemplatesHorizontalBar(applicationId, startDateTime, endDateTime, baselineTagId, compareTagId)
  }


    radioChange(event){
      this.selectedRadioOption = event
    }

  computeLogCompare(){
    this.isSpinning = true
    this.logCompareService.computeLogCompare(this.applicationId, this.baselineTagId, this.compareTagId, this.selectedRadioOption).subscribe(resp => {
        this.tableDataUnified = resp
      console.log(this.tableDataUnified)
      this.isSpinning = false

      setTimeout(_ => {
        $('.inlinesparkline').sparkline('html', {width: '6vh', height: '1.8vh'});
        $('.barsparkline').sparkline('html', {type: 'bar'});
        $('.dualsparkline').sparkline('html', {type: 'bar', barColor: 'blue', tagValuesAttribute: 'barvalues', width: '60px', barWidth: "7" });
        $('.dualsparkline').sparkline('html', {type: 'line', lineColor: 'red', fillColor: false, tagValuesAttribute: 'linevalues', width: '60px', composite: true,});}, 50); //hack to start first refresh

      })
    this.loadBarDataUnified(this.startDateTime, this.endDateTime, this.applicationId)
    // if (this.applicationId && this.compareTagId && this.baselineTagId && this.compareTagId!=this.baselineTagId){
    //   this.logCompareService.computeLogCompare(this.applicationId, this.baselineTagId, this.compareTagId).subscribe(resp => {
    //     console.log(resp)
    //   })
    // }else {
    //   this.notificationService.bare("Make sure that the baseline and compare versions are different!")
    // }
  }

  logCountBar(tag){
    this.logCompareService.getLogCountBar(this.applicationId, this.startDateTime, this.endDateTime, tag).subscribe(resp => {
      for (let i = 0; i < resp[0].series.length; i++) {
        var date = moment.utc(resp[0].series[i].name, 'DD-MM-YYYY HH:mm:ss.SSS').format('DD-MM-YYYY HH:mm:ss.SSS');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm:ss.SSS');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm:ss.SSS').local().format('MMM DD HH:mm');
        resp[0].series[i].name = local.toString()
      }
      if (tag==this.baselineTagId){
        this.logBarFirst = resp[0].series
      }else{
        this.logBarSecond = resp[0].series
      }
          // console.log(this.logBarFirst, this.logBarSecond)
    }

    );
  }

  onHeatMapSelect(data: any) {

    try {
      var timeDiff = this.getTimeDiff()
    }catch (e) {
    }

    if (!timeDiff){
      timeDiff = 1
    }
    const dateTime = data.extra
    const date = dateTime.split(' ')[0].split('-');
    const time = dateTime.split(' ')[1].split(':');
    const startDateTime: Moment = moment().year(+date[2]).month(+date[1] - 1).date(+date[0]).hour(+time[0]).minute(
      +time[1]);

    this.startDateTime = startDateTime.format('YYYY-MM-DDTHH:mm') + ":00"
    this.endDateTime = startDateTime.add(timeDiff, 'minutes').format('YYYY-MM-DDTHH:mm') + ":00"
    this.logCountBar(this.compareTagId)
    this.loadCompareTemplatesHorizontalBar(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
    this.loadLogCompareData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
    this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
    this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId, "new_templates")
    this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, "", this.compareTagId, "")
    this.reload$.next()


  }


  toLocalTime(data){
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
    this.logCountBar(this.compareTagId)
    this.loadCompareTemplatesHorizontalBar(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
    this.loadLogCompareData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
    this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
    this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId, "new_templates")
    this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, "", this.compareTagId, "")
    this.loadBarDataUnified(this.startDateTime, this.endDateTime, this.applicationId)

    this.reload$.next()
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

  filterApplicationsWithVersions(){
    // this.loadApplicationVersions(this.applications[0].id)
    for (let i=0; i < this.applications.length; i++){
      let tags = this.loadApplicationVersions(this.applications[i].id)
    }

  }

  applicationSelected(appId: number) {
    this.applicationId = appId;
    this.loadApplicationVersions(this.applicationId)
    // this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
    // this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
  }

  baselineTagSelected(tagId: string) {
    this.baselineTagId = tagId;
    this.logCountBar(this.baselineTagId)
    this.reload$.next()
    // this.loadApplicationVersions(this.applicationId, this.tagId)
    // this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
    // this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
  }

  compareTagSelected(tagId: string) {
    this.compareTagId = tagId;
    this.logCountBar(this.compareTagId)
    this.loadCompareTemplatesHorizontalBar(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
    this.loadLogCompareData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
    this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)
    this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId, "new_templates")
    this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, "", this.compareTagId, "")
    this.reload$.next()
    // this.loadApplicationVersions(this.applicationId, this.tagId)
    // this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
    // this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
  }


  private loadLogCompareData(startTime: string, endTime: string, applicationId: number, baselineTagId: string, compareTagId: string) {
    this.tableData = []
    this.countAnomalies = []
    this.newTemplates = []
    this.matchPercentage = 0.0
    this.logCompareService.loadLogCompareData(startTime, endTime, applicationId,baselineTagId, compareTagId).subscribe(data => {
      this.tableData = data
      let countAnomaliesMap = new Map<string, string>();
      let newTemplatesMap = new Map<string, string>();
      for(let i = 0; i < data.length; i++){
        this.matchPercentage += data[i].ratioScore
        for(let j = 0; j < data[i].countAnomalyList.length; j++){
          if (countAnomaliesMap.has(data[i].countAnomalyList[j].template)){
            if (!(countAnomaliesMap.get(data[i].countAnomalyList[j].template) == data[i].countAnomalyList[j].timestamp)){
                this.countAnomalies.push(data[i].countAnomalyList[j])
                countAnomaliesMap.set(data[i].countAnomalyList[j].template, data[i].countAnomalyList[j].timestamp);
            }
          }else{
            this.countAnomalies.push(data[i].countAnomalyList[j])
                countAnomaliesMap.set(data[i].countAnomalyList[j].template, data[i].countAnomalyList[j].timestamp);
          }
        }
        for(let k = 0; k < data[i].newTemplateList.length; k++){
          if (!newTemplatesMap.has(data[i].newTemplateList[k].template)){
            if (!(newTemplatesMap.get(data[i].newTemplateList[k].template) == data[i].newTemplateList[k].timestamp)){
                this.newTemplates.push(data[i].newTemplateList[k])
                newTemplatesMap.set(data[i].newTemplateList[k].template, data[i].newTemplateList[k].timestamp);
            }
          }
        }
      }
      this.matchPercentage = this.matchPercentage * 100 / data.length
      this.matchPercentage = round(this.matchPercentage * 100) / 100
      this.countAnomalies = this.toLocalTime(this.countAnomalies)

      this.newTemplates = this.toLocalTime(this.newTemplates)

    })

  }



  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  private loadApplicationVersions(applicationId: number) {

    this.logCompareService.loadApplicationVersions(applicationId).subscribe(resp => {
      this.tags = resp
      for(let i=0; i< this.tags.length; i++){
        this.tags[i] = this.tags[i].slice(this.tags[i].length - 8,this.tags[i].length) + "_" + this.tags[i]
      }
        if (resp.length > 1){
          this.baselineTagId = this.tags[0].split('_')[1]
          this.compareTagId = this.tags[1].split('_')[1]
        }else {
          this.baselineTagId = this.tags[0].split('_')[1]
          this.compareTagId = this.tags[0].split('_')[1]
        }
      },
      error => {
        this.notificationService.error("Bad request, contact support!")
      })
  }

  private getTimeDiff() {
    let timeList = []
    let indx = []
    for(let i = 0; i < this.heatmapData.length; i++){
      if (this.heatmapData[i].series.length){
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
    this.dashboardService.getAllTimeRanges().subscribe(resp => {
      this.predefinedTimes = resp
    })
  }


    onDeletePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.deleteTimeRange(predefinedTime).subscribe(() => this.loadPredefinedTimes())
  }

  onSavePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.createTimeRange(predefinedTime).subscribe(resp => this.loadPredefinedTimes())
  }

  onSelectPredefinedTime(pt: PredefinedTime) {
    if (pt.dateTimeType == 'RELATIVE') {
      this.onDateTimeSearch({ relativeTimeChecked: true, relativeDateTime: pt.startTime })
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
