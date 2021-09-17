import {
  Component, OnDestroy,
  OnInit, TemplateRef, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { QualityService } from './quality.service';
import { options } from './chart-options';
import { IncidentTableData } from '../../@core/common/incident-table-data';
import 'd3';
import 'nvd3';
import {combineLatest, Observable, Subject, timer} from 'rxjs';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { MessagingService } from '../../@core/service/messaging.service';
import { NotificationsService } from 'angular2-notifications';
import { NbDialogService, NbPopoverDirective } from '@nebular/theme';
import * as moment from 'moment'
import { map, retry, share, switchMap, takeUntil } from 'rxjs/operators';
import { DashboardService } from '../dashboard/dashboard.service';
import { Application } from '../../@core/common/application';
import { AuthenticationService } from '../../auth/authentication.service';
import { IntegrationService } from '../../@core/service/integration.service';
import {LogQualityTableData} from "../../@core/common/log-quality-table-data";
import {LogQualityOverview} from "../../@core/common/log-quality-overview";
import { DecimalPipe,formatNumber } from '@angular/common';
import {PredefinedTime} from "../../@core/common/predefined-time";

@Component({
  selector: 'quality',
  styleUrls: ['./quality.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './quality.page.html',
  encapsulation: ViewEncapsulation.None
})
export class QualityPage implements OnInit, OnDestroy {
  heatmapData = [];
  logLevelData = [];
  tableData: LogQualityOverview;
  linguisticData = [];
  options = options.timelineChart()
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  openDatePicker = false;
  applicationId: number;
  applications: Application[] = [];
  heatmapHeightList = [];
  unique = [];

  logQualityData$: Observable<any>;
  loadQualityOverview$: Observable<any>;
  private stopPolling = new Subject();
  reload$: Subject<boolean> = new Subject();

  gaugeTypeLogLevel = 0;
  gaugeTypeLinguistic = 0;
  gaugeTypeOverall = 0;
  isSpinning = false;
  startDateTime = 'now-720m';
  endDateTime = 'now'
  heatmapHeight = '200px';
  private destroy$: Subject<void> = new Subject<void>();
  predefinedTimes: PredefinedTime[] = [];

  gaugeType = "arch";
  gaugeValue = 28.3;
  gaugeLabel = "Log quality";
  gaugeAppendText = "%";
  thresholdConfigLogLevel = {
        '0': {color: 'red'},
        '40': {color: 'orange'},
        '70': {color: 'yellow'}
    };

  constructor(private route: ActivatedRoute,
              private qualityService: QualityService,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService,
              private dashboardService: DashboardService,
              private authService: AuthenticationService,
              private integrationService: IntegrationService,
              private router: Router) {

     this.logQualityData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)),
      share(),
      takeUntil(this.stopPolling)
    );
     this.loadQualityOverview$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)),
      share(),
      takeUntil(this.stopPolling)
    );

  }

  ngOnInit(): void {

    this.logQualityData$.subscribe( resp => {
      if (resp.length > 0){
        this.isSpinning = false
      }
    this.logLevelData = []
    this.linguisticData = []
      let data = this.toLocalTime(resp)
      for (let i = 0; i < data.length; i++){
        if (!resp[i].predictedLevel.includes(resp[i].actualLevel)){
          this.logLevelData.push(resp[i])
        }
        if (resp[i].linguisticPrediction < 0.5){
          this.linguisticData.push(resp[i])
        }
      }
    }
    )

    this.loadQualityOverview$.subscribe(resp => {
      const roundTo = function(num: number, places: number) {
      const factor = 10 ** places;
      return Math.round(num * factor) / factor;
        };
      this.gaugeTypeLogLevel = 0
      this.gaugeTypeOverall = 0
      this.gaugeTypeLinguistic = 0

      for (let i=0; i < resp.length; i++){
        resp[i].logLevelScore = roundTo(resp[i].logLevelScore, 2)
        resp[i].linguisticPrediction = roundTo(resp[i].linguisticPrediction, 2)
        this.gaugeTypeLogLevel = this.gaugeTypeLogLevel + resp[i].logLevelScore
        this.gaugeTypeLinguistic = this.gaugeTypeLinguistic + resp[i].linguisticPrediction
        this.gaugeTypeOverall = this.gaugeTypeOverall + (resp[i].logLevelScore + resp[i].linguisticPrediction) / 2
      }
      this.gaugeTypeLogLevel = Math.round(this.gaugeTypeLogLevel * 100 / resp.length)
      this.gaugeTypeLinguistic = Math.round(this.gaugeTypeLinguistic * 100 / resp.length)
      this.gaugeTypeOverall = Math.round(this.gaugeTypeOverall * 100 / resp.length)
      this.tableData = resp
    })



    this.loadPredefinedTimes();

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
      this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
      this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
    });



    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => {
      this.applications = resp;
      if (this.applications.length > 0) {
        // this.applicationId = this.applications[0].id;
        this.applicationSelected(this.applicationId);
      }
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
      this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
      this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = event.absoluteDateTime.startDateTime
      this.endDateTime = event.absoluteDateTime.endDateTime
      this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
      this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
    }
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

  computeLogQuality(){
    this.isSpinning = true
    this.qualityService.computeLogQuality(this.startDateTime, this.endDateTime).subscribe(resp => {
    }, error => {
      this.notificationService.error("Bad request, contact support!")
    })
    }

  applicationSelected(appId: number) {
    appId === 0 ? this.applicationId = null : this.applicationId = appId;
    this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
    this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
    this.reload$.next()
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

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadQualityData(startDateTime: string, endDateTime: string, applicationId: number) {
    return this.qualityService.loadQualityData(startDateTime, endDateTime, applicationId)
  }

  private loadQualityOverview(startDateTime: string, endDateTime: string, applicationId: number) {
    return this.qualityService.loadQualityOverview(startDateTime, endDateTime, applicationId)
  }
}
