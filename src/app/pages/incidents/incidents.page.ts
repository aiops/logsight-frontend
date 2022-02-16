import {
  Component, OnDestroy,
  OnInit, TemplateRef, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IncidentsService} from './incidents.service';
import {options} from './chart-options';
import {IncidentTableData} from '../../@core/common/incident-table-data';
import 'd3';
import 'nvd3';
import {Subject} from 'rxjs';
import {
  SpecificTemplateModalComponent
} from '../../@core/components/specific-template-modal/specific-template-modal.component';
import {VariableAnalysisService} from '../../@core/service/variable-analysis.service';
import {MessagingService} from '../../@core/service/messaging.service';
import {NotificationsService} from 'angular2-notifications';
import {NbDialogService, NbPopoverDirective} from '@nebular/theme';
import * as moment from 'moment'
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {DashboardService} from '../dashboard/dashboard.service';
import {Application} from '../../@core/common/application';
import {AuthenticationService} from '../../auth/authentication.service';
import {IntegrationService} from '../../@core/service/integration.service';
import {PredefinedTime} from '../../@core/common/predefined-time';
import {ChartRequest} from "../../@core/common/chart-request";
import {ChartConfig} from "../../@core/common/chart-config";
import {FormControl, FormGroup} from "@angular/forms";
import {LogsightUser} from "../../@core/common/logsight-user";
import {ApiService} from "../../@core/service/api.service";

@Component({
  selector: 'incidents',
  styleUrls: ['./incidents.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './incidents.page.html',
  encapsulation: ViewEncapsulation.None
})
export class IncidentsPage implements OnInit, OnDestroy {
  heatmapData = [];
  hasError = false;
  barData = [];
  options = options.timelineChart()
  @ViewChild('dateTimePicker', {read: TemplateRef}) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  openDatePicker = false;
  applicationId: string = null;
  applications: Application[] = [];
  heatmapHeightList = [];
  unique = [];
  startDateTime = 'now-720m';
  endDateTime = 'now'
  heatmapHeight = '200px';
  isViewDetails = "false";
  numberOfIncidents = 10;

  predefinedTimes: PredefinedTime[] = [];
  topKIncidents: IncidentTableData[] = [];
  detailedIncident: IncidentTableData;

  user: LogsightUser;
  userId: string;
   numberOfIncidentsFormGroup = new FormGroup({
    numberOfIncidents: new FormControl(this.numberOfIncidents),
  });

  private destroy$: Subject<void> = new Subject<void>();
  clientTimezoneOffset = Intl.DateTimeFormat().resolvedOptions().timeZone
  constructor(private route: ActivatedRoute,
              private incidentsService: IncidentsService,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService,
              private dashboardService: DashboardService,
              private authService: AuthenticationService,
              private integrationService: IntegrationService,
              private apiService: ApiService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.authService.getLoggedUser(this.userId).subscribe(user => {
      this.user = user
    })
    this.loadPredefinedTimes(this.user.id);
    this.route.queryParamMap.subscribe(queryParams => {
      let selectedTime = JSON.parse(localStorage.getItem("selectedTime"))
      let startTime = queryParams.get('startTimeSpecific') ?? selectedTime['startTime'] ?? queryParams.get('startTime')
      let endTime = queryParams.get('endTimeSpecific') ?? selectedTime['endTime'] ?? queryParams.get('endTime')
      this.isViewDetails = queryParams.get('viewDetails')
      if (startTime.toString().includes(":")) {
        startTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')
        endTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')

      }
      const applicationParam = queryParams.get('applicationId')
      const dateTimeType = queryParams.get('dateTimeType');
      this.applicationId = applicationParam ? applicationParam : null
      if (startTime && endTime) {
        if (dateTimeType == 'absolute') {
          this.startDateTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
          this.endDateTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
        } else {
          this.startDateTime = startTime;
          this.endDateTime = endTime;
        }
      }
      this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
      // this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId)
    });

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
            }, error => {
              this.apiService.handleErrors(error)
            })
        }
      })

    this.authService.getLoggedUser(this.userId).pipe(
      switchMap(user => this.integrationService.loadApplications(user.id))
    ).subscribe(resp => {
      this.applications = resp.applications;
      if (this.applications.length > 0) {
        this.applicationSelected(this.applicationId);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  loadPredefinedTimes(userId: string) {
    this.dashboardService.getAllTimeRanges(userId).subscribe(resp => this.predefinedTimes = resp.timeSelectionList)
  }

  toLocalTime(data) {
    for (let i = 0; i < data.length; i++) {
      let date = moment.utc(data[i].timestamp, 'DD-MM-YYYY HH:mm:ss.SSS').format('DD-MM-YYYY HH:mm:ss.SSS');
      let stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm:ss.SSS');
      let local = moment(stillUtc, 'DD-MM-YYYY HH:mm:ss.SSS').local().format('DD-MM-YYYY HH:mm:ss.SSS');
      data[i].timestamp = local.toString()
      if (data[i].actualLevel == 'ERROR' || data[i].actualLevel == 'CRITICAL' || data[i].actualLevel == 'SEVERE') {
        this.hasError = true
      }

    }
    return data
  }

  private loadIncidentsTableData(startTime: string, endTime: string, applicationId: string | null) {
    let type = 'tablechart'
    let feature = 'incidents'
    let indexType = 'incidents'
    let timeZone = this.clientTimezoneOffset
    let chartRequest = new ChartRequest(new ChartConfig(type, startTime, endTime, feature, indexType, timeZone), applicationId)
    this.incidentsService.loadIncidentsTableData(this.userId, chartRequest).subscribe(data => {
      data = data.data.data
      if (data) {
        this.topKIncidents = data.map(it => {
          const scAnomalies = this.parseTemplates(it, 'scAnomalies').sort((a, b) => b.timestamp - a.timestamp)
          const newTemplates = this.parseTemplates(it, 'newTemplates').sort((a, b) => b.timestamp - a.timestamp)
          const semanticAD = this.parseTemplates(it, 'semanticAD').sort((a, b) => b.timestamp - a.timestamp)
          const countAD = this.parseTemplates(it, 'countAD').sort((a, b) => b.timestamp - a.timestamp)
          const logs = this.parseTemplates(it, 'logs').sort((a, b) => b.timestamp - a.timestamp)
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
        })
        if (this.isViewDetails == "true"){
          this.detailedIncident = this.topKIncidents[0]
        }
        ;
      }
    })
  }

  moment(startTimestamp: string | undefined) {
    var date = moment.utc(startTimestamp, 'YYYY-MM-DD HH:mm:ss.SSS').format('DD-MM-YYYY HH:mm');
    var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
    var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
    return local.toString()
  }

  viewDetails(startTime: string, endTime: string, applicationId: string) {
    this.navigateToIncidentsPage(startTime, endTime, applicationId, "true")
  }

  navigateToIncidentsPage(startTime: string, endTime: String, applicationId: string, viewDetails:string = "false") {
    this.router.navigate(['/pages', 'incidents'], {
      queryParams: {
        startTimeSpecific: startTime,
        endTimeSpecific: endTime,
        applicationId: applicationId,
        viewDetails: viewDetails
      }
    })
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
        timeStamp:  it2[0]['@timestamp'],
        applicationId: data.applicationId //this should be checked
      }
    });
  }


  onDateTimeSearch(event) {
    this.popover.hide();
    this.openDatePicker = false;
    let dateTimeType = 'absolute';
    if (event.relativeTimeChecked) {
      dateTimeType = 'relative'
      this.startDateTime = event.relativeDateTime
      this.endDateTime = 'now'
      // this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId)
      this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = event.absoluteDateTime.startDateTime
      this.endDateTime = event.absoluteDateTime.endDateTime
      // this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId)
      this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
    }
    localStorage.setItem("selectedTime", JSON.stringify({
      startTime: this.startDateTime,
      endTime: this.endDateTime,
      dateTimeType
    }))
    // this.router.navigate([],
    //   { queryParams: { startTime: this.startDateTime, endTime: this.endDateTime, dateTimeType } })
  }

  changeTopKIncidents() {
    this.numberOfIncidents = this.numberOfIncidentsFormGroup.controls['numberOfIncidents'].value;
    this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
  }


  openPopover() {
    this.popover.show();
    this.openDatePicker = !this.openDatePicker
    if (!this.openDatePicker) {
      this.popover.hide();
    }
  }

  applicationSelected(appId: string) {
    appId === null ? this.applicationId = null : this.applicationId = appId;
    this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
    // this.loadBarData(this.startDateTime, this.endDateTime, this.applicationId)
  }

  onDeletePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.deleteTimeRange(this.user.id, predefinedTime).subscribe(() => this.loadPredefinedTimes(this.user.id))
  }

  onSavePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.createTimeRange(this.user.id, predefinedTime).subscribe(_ => this.loadPredefinedTimes(this.user.id))
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


  // onHeatMapSelect(data: any) {
  //   try {
  //     var timeDiff = this.getTimeDiff()
  //   }catch (e) {
  //   }
  //
  //   if (!timeDiff){
  //     timeDiff = 1
  //   }
  //   const dateTime = data.extra
  //   const date = dateTime.split(' ')[0].split('-');
  //   const time = dateTime.split(' ')[1].split(':');
  //   const startDateTime: Moment = moment().year(+date[2]).month(+date[1] - 1).date(+date[0]).hour(+time[0]).minute(
  //     +time[1]);
  //
  //   this.startDateTime = startDateTime.format('YYYY-MM-DDTHH:mm') + ":00"
  //   this.endDateTime = startDateTime.add(timeDiff, 'minutes').format('YYYY-MM-DDTHH:mm') + ":00"
  //
  //   this.loadBarData(this.startDateTime, this.endDateTime, data.id)
  //   this.loadIncidentsTableData(this.startDateTime, this.endDateTime, data.id)
  // }

  // getTimeDiff() {
  //   let timeList = []
  //   let indx = []
  //   for(let i = 0; i < this.heatmapData.length; i++){
  //     if (this.heatmapData[i].series.length){
  //       indx.push(i)
  //       timeList.push(this.heatmapData[i].series[0].extra)
  //     }
  //   }
  //   let date = timeList[0].split(' ')[0].split('-');
  //   let time = timeList[0].split(' ')[1].split(':');
  //   const firstTime: Moment = moment().year(+date[2]).month(+date[1] - 1).date(+date[0]).hour(+time[0]).minute(
  //     +time[1]);
  //   date = timeList[1].split(' ')[0].split('-');
  //   time = timeList[1].split(' ')[1].split(':');
  //   const secondTime: Moment = moment().year(+date[2]).month(+date[1] - 1).date(+date[0]).hour(+time[0]).minute(
  //     +time[1]);
  //   return (secondTime.diff(firstTime, "minutes") / indx[1] - indx[0])
  //
  // }


  // loadBarData(startTime: string, endTime: string, applicationId: number | null) {
  //   return this.dashboardService.loadBarData(startTime, endTime, applicationId).subscribe(data => {
  //     for (let i = 0; i < data.length; i++) {
  //       var date = moment.utc(data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
  //       var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
  //       var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
  //       data[i].name = local.toString()
  //     }
  //     this.barData = data;
  //   })
  // }
  //
  // loadHeatmapData(startTime: string, endTime: string, applicationId: number | null) {
  //   return this.dashboardService.loadHeatmapData(startTime, endTime, applicationId).subscribe(
  //     data => {
  //       for (let i = 0; i < data.data.length; i++) {
  //
  //         for (let j = 0; j < data.data[i].series.length; j++) {
  //         data.data[i].series[j].extra = data.data[i].name
  //       }
  //         var date = moment.utc(data.data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
  //         var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
  //         var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('MMM DD HH:mm');
  //         data.data[i].name = local.toString()
  //       }
  //       for (let i = 0; i < data.data.length; i++) {
  //         for (let j = 0; j < data.data[i].series.length; j++) {
  //           this.heatmapHeightList.push(data.data[i].series[j].name)
  //         }
  //       }
  //       this.unique = Array.from(new Set(this.heatmapHeightList.map(team => team)));
  //       if (this.unique.length > 0) {
  //         if (50 * (this.unique.length) < 350) {
  //           this.heatmapHeight = (50 * (this.unique.length + 1)).toString() + 'px'
  //         } else {
  //           this.heatmapHeight = '300px'
  //         }
  //       } else {
  //         this.heatmapHeight = '150px'
  //       }
  //       this.heatmapData = data.data;
  //     })
  // }

}
