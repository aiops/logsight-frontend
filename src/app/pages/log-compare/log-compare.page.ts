import {
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
import { map, retry, share, switchMap, takeUntil } from 'rxjs/operators';
import { DashboardService } from '../dashboard/dashboard.service';
import { Application } from '../../@core/common/application';
import { AuthenticationService } from '../../auth/authentication.service';
import { IntegrationService } from '../../@core/service/integration.service';
import {LogQualityOverview} from "../../@core/common/log-quality-overview";

@Component({
  selector: 'log-compare',
  styleUrls: ['./log-compare.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './log-compare.page.html',
  encapsulation: ViewEncapsulation.None
})
export class LogComparePage {

  options = options.timelineChart()
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  openDatePicker = false;
  applicationId: number;
  applications: Application[] = [];
  tags: String[] = [];
  baselineTagId: string;
  matchPercentage = "100%"
  logBarFirst = []
  logBarSecond = []
  colorSchemeFirst = {
    domain: ['#22c08f']
  };
  colorSchemeSecond = {
    domain: ['#8bb4ff']
  };

  compareTagId: string;
  heatmapHeightList = [];
  unique = [];
  startDateTime = 'now-720m';
  endDateTime = 'now'
  heatmapHeight = '200px';
  barDataFirst$: Observable<any>;
  barDataFirst = []
  barDataSecond$: Observable<any>;
  barDataSecond = []
  horizontalData = []
  horizontalData$: Observable<any>;
  tableData = []
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
  }


  ngOnInit(): void {

    this.barDataFirst$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.barDataSecond$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, this.compareTagId)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.barDataSecond$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId, this.compareTagId)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.horizontalData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadCompareTemplatesHorizontalBar(this.startDateTime, this.endDateTime, this.applicationId, this.baselineTagId, this.compareTagId)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.barDataFirst$.subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('hh:mm A');
        data[i].name = local.toString()
      }
      this.barDataFirst = data;
    })

    this.barDataSecond$.subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('hh:mm A');
        data[i].name = local.toString()
      }
      this.barDataSecond = data;
    })

    this.horizontalData$.subscribe(data => {
      this.horizontalData = data;
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
      this.applications = resp;
      if (this.applications.length > 0) {
        this.applicationId = this.applications[0].id;
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


  loadBarData(startDateTime, endDateTime, applicationId, baselineTagId) {
    return this.logCompareService.getCognitiveBarData(applicationId, startDateTime, endDateTime, baselineTagId);
  }

  loadCompareTemplatesHorizontalBar(startDateTime, endDateTime, applicationId, baselineTagId, compareTagId) {
    return this.logCompareService.loadCompareTemplatesHorizontalBar(applicationId, startDateTime, endDateTime, baselineTagId, compareTagId)
  }

  computeLogCompare(){
    if (this.applicationId && this.compareTagId && this.baselineTagId && this.compareTagId!=this.baselineTagId){
      this.logCompareService.computeLogCompare(this.applicationId, this.baselineTagId, this.compareTagId).subscribe(resp => {
        console.log(resp)
      })
    }else {
      this.notificationService.bare("Make sure that the baseline and compare versions are different!")
    }
  }

  logCountBar(tag){
    this.logCompareService.getLogCountBar(this.applicationId, this.startDateTime, this.endDateTime, tag).subscribe(resp => {
      console.log(resp)
      for (let i = 0; i < resp[0].series.length; i++) {
        var date = moment.utc(resp[0].series[i].name, 'DD-MM-YYYY HH:mm:ss.SSS').format('DD-MM-YYYY HH:mm:ss.SSS');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm:ss.SSS');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm:ss.SSS').local().format('HH:mm A');
        resp[0].series[i].name = local.toString()
      }
      if (tag==this.baselineTagId){
        this.logBarFirst = resp[0].series
      }else{
        this.logBarSecond = resp[0].series
      }
    });
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
    this.reload$.next()
    // this.loadApplicationVersions(this.applicationId, this.tagId)
    // this.loadQualityData(this.startDateTime, this.endDateTime, this.applicationId)
    // this.loadQualityOverview(this.startDateTime, this.endDateTime, this.applicationId)
  }


  private loadLogCompareData(startTime: string, endTime: string, applicationId: number, baselineTagId: string, compareTagId: string) {
    this.tableData = []
    this.logCompareService.loadLogCompareData(startTime, endTime, applicationId,baselineTagId, compareTagId).subscribe(resp => {
      console.log("RESP", resp)
    })

  }



  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  private loadApplicationVersions(applicationId: number) {

    this.logCompareService.loadApplicationVersions(applicationId).subscribe(resp => {
      this.tags = resp
      // this.notificationService.success("Versions loaded")
    }, error => {
      this.notificationService.error("Bad request, contact support!")
    })

  }
}
