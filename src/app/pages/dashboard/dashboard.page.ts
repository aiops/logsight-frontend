import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService, NbPopoverDirective, NbThemeService } from '@nebular/theme';
import { DashboardService } from './dashboard.service';
import { TopKIncident } from '../../@core/common/top-k-Incident';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { MessagingService } from '../../@core/service/messaging.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthenticationService } from '../../auth/authentication.service';
import { debounceTime, map, retry, share, skip, switchMap, takeUntil, timeout } from 'rxjs/operators';
import { Application } from '../../@core/common/application';
import { IntegrationService } from '../../@core/service/integration.service';
import {Observable, Subject, timer, combineLatest, Subscription} from 'rxjs';
import { Moment } from 'moment';
import * as moment from 'moment'
import { TourService } from 'ngx-ui-tour-md-menu';
import { PredefinedTime } from '../../@core/common/predefined-time';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {element} from "protractor";
import {dataService} from "../charts-wrapper-module/pie-chart/data.service";
//import {dataService} from "../charts-wrapper-module/pie-chart/data.service";

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit, OnDestroy {
  heatmapData = [];
  pieData = [] ;
  element_name = "";
  colorSubscription: Subscription;
  pieChartData = [];
  stackedChartData = [];
  barDatabarData = [];
  barData = []
  topKIncidents: TopKIncident[] = [];
  applications: Application[] = [];
  private stopPolling = new Subject();
  openDatePicker = false;
  heatmapData$: Observable<any>;
  pieChartData$: Observable<any>;
  stackedAreaChartData$: Observable<any>;
  topKIncidents$: Observable<any>;
  barData$: Observable<any>;
  startDateTime = 'now-720m';
  endDateTime = 'now'
  heatmapHeight = '200px';
  numberOfIncidents = 5;
  heatmapHeightList = [];
  unique = [];
  colorPieData = {}
  reload$: Subject<boolean> = new Subject();
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  private destroy$: Subject<void> = new Subject<void>();
  predefinedTimes: PredefinedTime[] = [];
  numberOfIncidentsFormGroup = new FormGroup({
    numberOfIncidents: new FormControl(5),
  });

  constructor(private dashboardService: DashboardService, private router: Router, private route: ActivatedRoute,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService,
              private authService: AuthenticationService,
              private integrationService: IntegrationService,
              private tourService: TourService,
              private colorService: dataService) {

    this.heatmapData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadHeatmapData(this.startDateTime, this.endDateTime)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.pieChartData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadPieChartData(this.startDateTime, this.endDateTime)),
      share(),
      takeUntil(this.stopPolling),
    );

    this.stackedAreaChartData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadStackedAreaChartData(this.startDateTime, this.endDateTime)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.topKIncidents$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadTopKIncidents(this.startDateTime, this.endDateTime, this.numberOfIncidents)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.barData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadBarData(this.startDateTime, this.endDateTime)),
      share(),
      takeUntil(this.stopPolling)
    );
  }

  ngOnInit(): void {

    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => this.applications = resp)
    // if (this.applications.length == 0){
    //   this.router.navigate(['/pages','ingest_logs'])
    // }
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

    this.pieChartData$.subscribe(data => {
      this.pieData = []
      this.pieChartData = data.data;
      this.pieChartData.forEach(element => {
        this.element_name = element.name.toLowerCase()
        if(this.element_name=="info" || this.element_name=="fine") {
          this.pieData.push('#00ff00')
        } else if(this.element_name=="warn" || this.element_name=="warning") {
          this.pieData.push('#d9bc00')
        } else if(this.element_name=="err" || this.element_name=="error" || this.element_name=="critical"){
          this.pieData.push('#ff0000')
        } else {
          this.pieData.push('#8338ec')
        }
      })
      this.colorPieData = {domain:this.pieData}
    })


    this.stackedAreaChartData$.subscribe(data => {
      for (let i = 0; i < data.data.length; i++) {
        for (let j = 0; j < data.data[i].series.length; j++) {
          var date = moment.utc(data.data[i].series[j].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
          var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
          var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
          data.data[i].series[j].name = local.toString()
        }
      }
      this.stackedChartData = data.data;
    })

    this.topKIncidents$.subscribe(data => {
      this.topKIncidents = data.map(it => {
        const scAnomalies = this.parseTemplates(it, 'scAnomalies').sort((a, b) => b.timeStamp - a.timeStamp)
        const newTemplates = this.parseTemplates(it, 'newTemplates').sort((a, b) => b.timeStamp - a.timeStamp)
        const semanticAD = this.parseTemplates(it, 'semanticAD').sort((a, b) => b.timeStamp - a.timeStamp)
        const countAD = this.parseTemplates(it, 'countAD').sort((a, b) => b.timeStamp - a.timeStamp)
        return {
          applicationId: it.applicationId,
          appName: it.indexName,
          timestamp: it.timestamp,
          startTimestamp: it.startTimestamp,
          stopTimestamp: it.stopTimestamp,
          scAnomalies,
          newTemplates,
          semanticAD,
          countAD
        }
      });
    })

    this.barData$.subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
        data[i].name = local.toString()
      }

      this.barData = data;
    })



    this.messagingService.getVariableAnalysisTemplate()
      .pipe(takeUntil(this.destroy$), map(it => it['item']))
      .subscribe(selected => {
        this.variableAnalysisService.loadSpecificTemplate(selected.applicationId, this.startDateTime,
          this.endDateTime, selected)
          .subscribe(
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
      })
    setTimeout(_ => this.reload$.next(), 2000); //hack to start first refresh

    this.route.queryParamMap.subscribe(queryParams => {
      const startTime = queryParams.get('startTime');
      const endTime = queryParams.get('endTime');
      const dateTimeType = queryParams.get('dateTimeType');
      if (startTime && endTime) {
        if (dateTimeType == 'absolute') {
          this.startDateTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
          this.endDateTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
        } else {
          this.startDateTime = startTime;
          this.endDateTime = endTime;
        }
        this.reload$.next()
      } else {
        this.startDateTime = 'now-720m'
        this.endDateTime = 'now'
        this.reload$.next()
      }
    })

    this.loadPredefinedTimes();
  }

  loadPredefinedTimes() {
    this.dashboardService.getAllTimeRanges().subscribe(resp => this.predefinedTimes = resp)
  }

  startTour() {
    this.tourService.start()
  }

  loadHeatmapData(startTime: string, endTime: string) {
    return this.dashboardService.loadHeatmapData(startTime, endTime, null)
  }

  loadBarData(startTime: string, endTime: string) {
    return this.dashboardService.loadBarData(startTime, endTime);
  }

  loadPieChartData(startTime: string, endTime: string) {
    return this.dashboardService.loadPieChartData(startTime, endTime);
  }

  loadStackedAreaChartData(startTime: string, endTime: string) {
    return this.dashboardService.loadStackedChartData(startTime, endTime);
  }

  loadTopKIncidents(startTime: string, endTime: string, numberOfIncidents: number) {
    return this.dashboardService.loadTopKIncidentsData(startTime, endTime, numberOfIncidents);
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

    this.navigateToIncidentsPage(this.startDateTime,
      this.endDateTime, data.id)
  }

  parseTemplates(data, incident) {
    return JSON.parse(data[incident]).map(it2 => {
      let params = [];
      Object.keys(it2[0]).forEach(key => {
        if (key.startsWith('param_')) {
          params.push({ key, value: it2[0][key] })
        }
      });
      return {
        message: it2[0].message,
        template: it2[0].template,
        params: params,
        actualLevel: it2[0].actual_level,
        timeStamp: new Date(it2[0]['@timestamp']),
        applicationId: data.applicationId //this should be checked
      }
    });
  }

  viewDetails(startTime: string, endTime: string, applicationId: number) {

    this.navigateToIncidentsPage(startTime, endTime, applicationId)
  }

  ngOnDestroy() {
    this.stopPolling.next();
    this.destroy$.next()
    this.destroy$.complete()
  }

  private navigateToIncidentsPage(startTime: string, endTime: String, applicationId: number) {
    this.router.navigate(['/pages', 'incidents'], { queryParams: { startTimeSpecific: startTime, endTimeSpecific: endTime, applicationId } })
  }

  onDateTimeSearch(event) {
    this.popover.hide();
    this.openDatePicker = false;
    let dateTimeType = 'absolute';
    if (event.relativeTimeChecked) {
      this.startDateTime = event.relativeDateTime
      this.endDateTime = 'now'
      dateTimeType = 'relative';
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = event.absoluteDateTime.startDateTime
      this.endDateTime = event.absoluteDateTime.endDateTime
    }
    this.router.navigate([],
      { queryParams: { startTime: this.startDateTime, endTime: this.endDateTime, dateTimeType } })
    this.reload$.next();
  }

  openPopover() {
    this.popover.show();
    this.openDatePicker = !this.openDatePicker
    if (!this.openDatePicker) {
      this.popover.hide();
    }
  }

  moment(startTimestamp: string | undefined) {
    var date = moment.utc(startTimestamp, 'YYYY-MM-DD HH:mm:ss.SSS').format('DD-MM-YYYY HH:mm');
    var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
    var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
    return local.toString()
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

  changeTopKIncidents() {
    this.numberOfIncidents = this.numberOfIncidentsFormGroup.controls['numberOfIncidents'].value;
    this.reload$.next()
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


}
