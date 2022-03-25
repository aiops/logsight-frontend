import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NbDialogService, NbPopoverDirective} from '@nebular/theme';
import {DashboardService} from './dashboard.service';
import {ActivatedRoute, Router} from '@angular/router';
import {VariableAnalysisService} from '../../@core/service/variable-analysis.service';
import {MessagingService} from '../../@core/service/messaging.service';
import {NotificationsService} from 'angular2-notifications';
import {AuthenticationService} from '../../auth/authentication.service';
import {share, switchMap, takeUntil} from 'rxjs/operators';
import {Application} from '../../@core/common/application';
import {IntegrationService} from '../../@core/service/integration.service';
import {combineLatest, Observable, Subject, timer} from 'rxjs';
import * as moment from 'moment';
import {Moment} from 'moment';
import {TourService} from 'ngx-ui-tour-md-menu';
import {PredefinedTime} from '../../@core/common/predefined-time';
import {FormControl, FormGroup} from '@angular/forms';
import {ChartRequest} from "../../@core/common/chart-request";
import {ChartConfig} from "../../@core/common/chart-config";
import {IncidentTableData} from "../../@core/common/incident-table-data";
import {LogsightUser} from "../../@core/common/logsight-user";
import {ApiService} from "../../@core/service/api.service";

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit, OnDestroy {
  heatmapData = [];
  pieData = [];
  element_name = "";
  selectedTime = "";
  pieChartData = [];
  applicationId = null;
  barData = []
  startDateTime = 'now-720m';
  endDateTime = 'now'
  heatmapHeight = '200px';
  numberOfIncidents = 5;
  heatmapHeightList = [];
  predefinedTimes: PredefinedTime[] = [];
  unique = [];
  colorPieData = {
    domain: ['#00ff00', '#ff0000', '#d9bc00', '#8338ec']
  };
  user: LogsightUser;
  topKIncidents: IncidentTableData[] = [];
  applications: Application[] = [];
  openDatePicker = false;
  private stopPolling = new Subject();
  heatmapData$: Observable<any>;
  pieChartData$: Observable<any>;
  topKIncidents$: Observable<any>;
  barData$: Observable<any>;
  clientTimezoneOffset = Intl.DateTimeFormat().resolvedOptions().timeZone
  reload$: Subject<boolean> = new Subject();

  userId: string;

  @ViewChild('dateTimePicker', {read: TemplateRef}) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  private destroy$: Subject<void> = new Subject<void>();


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
              private apiService: ApiService) {

    this.heatmapData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.pieChartData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadPieChartData(this.startDateTime, this.endDateTime, this.applicationId)),
      share(),
      takeUntil(this.stopPolling),
    );

    this.barData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.topKIncidents$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadTopKIncidents(this.startDateTime, this.endDateTime, this.numberOfIncidents, this.applicationId)),
      share(),
      takeUntil(this.stopPolling)
    );
  }

  ngOnInit(): void {
    // cancel spinner on click
    // the tour should show only once add coookie.
    const el = document.getElementById('nb-global-spinner');
    el.addEventListener('click', function(event) {
      el.style['display'] = 'none';
});
    this.userId = localStorage.getItem('userId')
    setTimeout(_ => this.reload$.next(), 5000); //hack to start first refresh
    setTimeout(_ => this.cancelGlobalSpinner(), 45000)
    this.integrationService.loadApplications(this.userId).subscribe(resp => {
      this.applications = resp.applications
    })
    this.authService.getLoggedUser(this.userId).subscribe(user => {
      this.user = user
    })
    this.loadPredefinedTimes(this.user.userId)

    this.heatmapData$.subscribe(data => {
      data = data.data
      // console.log("D", data.data)
      if (data.data.length>0) {
        const el = document.getElementById('nb-global-spinner');
        if (el) {
          el.style['display'] = 'none';
        }
        for (let i = 0; i < data.data.length; i++) {
          for (let j = 0; j < data.data[i].series.length; j++) {
            data.data[i].series[j].extra = data.data[i].name
          }
          var date = moment.utc(data.data[i].name, 'YYYY-MM-DDTHH:mmZ[UTC]').format('YYYY-MM-DD HH:mm');
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
            this.heatmapHeight = '350px'
          }
        } else {
          this.heatmapHeight = '150px'
        }
        this.heatmapData = data.data;
      }
    }, error => {
    })

    this.pieChartData$.subscribe(data => {
      data = data.data
      if (data) {
        this.pieData = []
        this.pieChartData = data.data;
        this.pieChartData.forEach(element => {
          this.element_name = element.name.toLowerCase()
          if (this.element_name == "info" || this.element_name == "fine") {
            this.pieData.push('#00ff00')
          } else if (this.element_name == "warn" || this.element_name == "warning") {
            this.pieData.push('#d9bc00')
          } else if (this.element_name == "err" || this.element_name == "error" || this.element_name == "critical") {
            this.pieData.push('#ff0000')
          } else {
            this.pieData.push('#8338ec')
          }
        })
        this.colorPieData = {domain: this.pieData}
      }
    }, error => {
    })

    this.topKIncidents$.subscribe(data => {
      data = data.data.data
      if (data) {
        this.topKIncidents = data.map(it => {
          const scAnomalies = this.parseTemplates(it, 'scAnomalies').sort((a, b) => b.timeStamp - a.timeStamp)
          const newTemplates = this.parseTemplates(it, 'newTemplates').sort((a, b) => b.timeStamp - a.timeStamp)
          const semanticAD = this.parseTemplates(it, 'semanticAD').sort((a, b) => b.timeStamp - a.timeStamp)
          const countAD = this.parseTemplates(it, 'countAD').sort((a, b) => b.timeStamp - a.timeStamp)
          const logs = this.parseTemplates(it, 'logs').sort((a, b) => b.timeStamp - a.timeStamp)
          return {
            applicationId: it.applicationId,
            appName: it.indexName,
            timestamp: it.timestamp,
            startTimestamp: it.startTimestamp,
            stopTimestamp: it.stopTimestamp,
            scAnomalies,
            newTemplates,
            semanticAD,
            countAD,
            logs
          }
        });
      }
    }, error => {
      this.apiService.handleErrors(error)
    })

    this.barData$.subscribe(data => {
      data = data.data.data
      if (data) {
        for (let i = 0; i < data.length; i++) {
          var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
          var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
          var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
          data[i].name = local.toString()
        }

        this.barData = data;
      }
    }, error => {
    })


    // this.messagingService.getVariableAnalysisTemplate()
    //   .pipe(takeUntil(this.destroy$), map(it => it['item']))
    //   .subscribe(selected => {
    //     this.variableAnalysisService.loadSpecificTemplate(selected.applicationId, this.startDateTime,
    //       this.endDateTime, selected)
    //       .subscribe(
    //         resp => {
    //           this.dialogService.open(SpecificTemplateModalComponent, {
    //             context: {
    //               data: resp.second,
    //               type: resp.first
    //             }, dialogClass: 'model-full'
    //           });
    //         }, err => {
    //           this.notificationService.error('Error', 'Error fetching data')
    //         })
    //   })


    this.route.queryParamMap.subscribe(queryParams => {
      this.selectedTime = localStorage.getItem("selectedTime")
      var startTime = ''
      var endTime = ''
      var dateTimeType = ''
      if (this.selectedTime && (queryParams.get('sample') != "true")) {
        console.log(queryParams)
        queryParams = JSON.parse(this.selectedTime)
        startTime = queryParams['startTime'];
        endTime = queryParams['endTime'];
        dateTimeType = queryParams['dateTimeType'];
      } else {
        startTime = queryParams.get('startTime');
        endTime = queryParams.get('endTime');
        dateTimeType = queryParams.get('dateTimeType');
      }

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
    this.reload$.next()

  }

  ngOnDestroy() {
    this.stopPolling.next();
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadPredefinedTimes(userId: string) {
    this.dashboardService.getAllTimeRanges(userId).subscribe(resp => {
      this.predefinedTimes = resp.timeSelectionList
    })
  }

  cancelGlobalSpinner() {
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
  }

  startTour() {
    this.tourService.start()
  }

  loadHeatmapData(startTime: string, endTime: string, applicationId: string) {
    let type = 'heatmap'
    let feature = 'system_overview'
    let indexType = 'incidents'
    let timeZone = this.clientTimezoneOffset
    let chartRequest = new ChartRequest(new ChartConfig(type, startTime, endTime, feature, indexType, timeZone), applicationId)
    return this.dashboardService.loadHeatmapData(this.userId, chartRequest)
  }

  loadBarData(startTime: string, endTime: string, applicationId: string) {
    let type = 'barchart'
    let feature = 'system_overview'
    let indexType = 'log_agg'
    let timeZone = this.clientTimezoneOffset
    let chartRequest = new ChartRequest(new ChartConfig(type, startTime, endTime, feature, indexType, timeZone), applicationId)
    return this.dashboardService.loadBarData(this.userId, chartRequest);
  }

  loadPieChartData(startTime: string, endTime: string, applicationId: string) {
    let type = 'piechart'
    let feature = 'system_overview'
    let indexType = 'log_agg'
    let timeZone = this.clientTimezoneOffset
    let chartRequest = new ChartRequest(new ChartConfig(type, startTime, endTime, feature, indexType, timeZone), applicationId)
    return this.dashboardService.loadPieChartData(this.userId, chartRequest);
  }

  loadTopKIncidents(startTime: string, endTime: string, numberOfIncidents: number, applicationId: string) {
    let type = 'tablechart'
    let feature = 'system_overview'
    let indexType = 'incidents'
    let timeZone = this.clientTimezoneOffset
    let chartRequest = new ChartRequest(new ChartConfig(type, startTime, endTime, feature, indexType, timeZone), applicationId)
    return this.dashboardService.loadTopKIncidentsData(this.userId, chartRequest);
  }

  onHeatMapSelect(data: any) {
    try {
      var timeDiff = this.getTimeDiff()
    } catch (e) {
    }
    if (!timeDiff) {
      timeDiff = 2
    }
    const dateTime = data.extra
    const date = dateTime.split('T')[0].split('-');
    const time = dateTime.split('T')[1].split(':');
    const startDateTime: Moment = moment().year(+date[0]).month(+date[1] - 1).date(+date[2]).hour(+time[0]).minute(
      +time[1].split('Z')[0]);

    this.startDateTime = startDateTime.format('YYYY-MM-DDTHH:mm') + ":00"
    this.endDateTime = startDateTime.add(timeDiff, 'minutes').format('YYYY-MM-DDTHH:mm') + ":00"
    this.navigateToIncidentsPage(this.startDateTime,
      this.endDateTime, data.applicationId)
  }

  parseTemplates(data, incident) {
    return JSON.parse(data[incident]).map(it2 => {
      let params = [];
      Object.keys(it2[0]).forEach(key => {
        if (key.startsWith('param_')) {
          params.push({key, value: it2[0][key]})
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

  viewDetails(startTime: string, endTime: string, applicationId: string) {
    this.navigateToIncidentsPage(startTime, endTime, applicationId)
  }

  navigateToIncidentsPage(startTime: string, endTime: String, applicationId: string) {
    this.router.navigate(['/pages', 'incidents'], {
          queryParams: {
        startTimeSpecific: startTime,
        endTimeSpecific: endTime,
        applicationId: applicationId,
        viewDetails: "true"
      }
    })
  }

  onDateTimeSearch(event) {
    localStorage.setItem('selectedTime', JSON.stringify(event));
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
    localStorage.setItem("selectedTime", JSON.stringify({
      startTime: this.startDateTime,
      endTime: this.endDateTime,
      dateTimeType
    }))
    this.router.navigate([],
      {queryParams: {startTime: this.startDateTime, endTime: this.endDateTime, dateTimeType}})
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
    this.dashboardService.deleteTimeRange(this.userId, predefinedTime).subscribe(() => this.loadPredefinedTimes(this.userId))
  }

  onSavePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.createTimeRange(this.userId, predefinedTime).subscribe(resp => this.loadPredefinedTimes(this.userId))
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

  changeTopKIncidents() {
    this.numberOfIncidents = this.numberOfIncidentsFormGroup.controls['numberOfIncidents'].value;
    this.reload$.next()
  }

  getTimeDiff() {
    let timeList = []
    let indx = []
    for (let i = 0; i < this.heatmapData.length; i++) {
      if (this.heatmapData[i].series.length) {
        indx.push(i)
        timeList.push(this.heatmapData[i].series[0].extra)
      }
    }
    let date_f = timeList[0].split('T')[0].split('-');
    let time_f = timeList[0].split('T')[1].split(':');
    const firstTime: Moment = moment().year(+date_f[0]).month(+date_f[1] - 1).date(+date_f[2]).hour(+time_f[0]).minute(
      +time_f[1].split('Z')[0]);
    let date_s = timeList[1].split('T')[0].split('-');
    let time_s = timeList[1].split('T')[1].split(':');
    const secondTime: Moment = moment().year(+date_s[0]).month(+date_s[1] - 1).date(+date_s[2]).hour(+time_s[0]).minute(
      +time_s[1].split('Z')[0]);
    return (secondTime.diff(firstTime, "minutes") / indx[1] - indx[0])

  }

  applicationSelected(appId: string) {
    appId === null ? this.applicationId = null : this.applicationId = appId;
    this.reload$.next()
  }

  removeApplication(id: string) {
    this.integrationService.deleteApplication(this.userId, id).subscribe(
      resp => {
        this.notificationService.success('Success', 'Application successfully deleted', this.apiService.getNotificationOpetions())
        this.loadApplications(this.userId)
        window.location.reload();
      }, error => {
        this.apiService.handleErrors(error)
      })
  }

  loadApplications(userId: string) {
    this.integrationService.loadApplications(userId).subscribe(resp => this.applications = resp.applications)
  }

}
