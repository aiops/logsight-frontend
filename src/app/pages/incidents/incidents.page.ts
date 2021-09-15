import {
  Component, OnDestroy,
  OnInit, TemplateRef, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IncidentsService } from './incidents.service';
import { options } from './chart-options';
import { IncidentTableData } from '../../@core/common/incident-table-data';
import 'd3';
import 'nvd3';
import { Observable, Subject, timer } from 'rxjs';
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
import { PredefinedTime } from '../../@core/common/predefined-time';
import {Moment} from "moment";

@Component({
  selector: 'incidents',
  styleUrls: ['./incidents.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './incidents.page.html',
  encapsulation: ViewEncapsulation.None
})
export class IncidentsPage implements OnInit, OnDestroy {
  heatmapData = [];
  tableData: IncidentTableData;
  options = options.timelineChart()
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  openDatePicker = false;
  applicationId: number;
  applications: Application[] = [];
  heatmapHeightList = [];
  unique = [];
  startDateTime = 'now-720m';
  endDateTime = 'now'
  heatmapHeight = '200px';
  predefinedTimes: PredefinedTime[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private incidentsService: IncidentsService,
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
    this.loadPredefinedTimes();
    this.route.queryParamMap.subscribe(queryParams => {
      let startTime = queryParams.get('startTime')
      let endTime = queryParams.get('endTime')

      if (startTime.toString().includes(":")){
        startTime = moment(queryParams.get('startTime'),'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')
        endTime = moment(queryParams.get('endTime'),'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')
      }
      const applicationParam = queryParams.get('applicationId')
      const dateTimeType = queryParams.get('dateTimeType');
      this.applicationId = applicationParam ? +applicationParam : null
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
      this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)
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
            }, err => {
              this.notificationService.error('Error', 'Error fetching data')
            })
        }
      })

    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => {
      this.applications = resp;
      if (this.applications.length > 0) {
        this.applicationSelected(this.applicationId);
      }
    })


  }

  loadPredefinedTimes() {
    this.dashboardService.getAllTimeRanges().subscribe(resp => this.predefinedTimes = resp)
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

  private loadIncidentsTableData(startTime: string, endTime: string, applicationId: number | null) {
    this.incidentsService.loadIncidentsTableData(startTime, endTime, applicationId).subscribe(resp => {
      resp['countAds'] = this.toLocalTime(resp['countAds'])
      resp['newTemplates'] = this.toLocalTime(resp['newTemplates'])
      resp['semanticCountAds'] = this.toLocalTime(resp['semanticCountAds'])
      resp['semanticAd'] = this.toLocalTime(resp['semanticAd'])
      this.tableData = resp
    })
  }

  loadHeatmapData(startTime: string, endTime: string, applicationId: number | null) {
    return this.dashboardService.loadHeatmapData(startTime, endTime, applicationId).subscribe(
      data => {
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
          if (50 * (this.unique.length) < 350) {
            this.heatmapHeight = (50 * (this.unique.length + 1)).toString() + 'px'
          } else {
            this.heatmapHeight = '300px'
          }
        } else {
          this.heatmapHeight = '150px'
        }
        this.heatmapData = data.data;
      })
  }

  onDateTimeSearch(event) {
    this.popover.hide();
    this.openDatePicker = false;
    let dateTimeType = 'absolute';
    if (event.relativeTimeChecked) {
      dateTimeType = 'relative'
      this.startDateTime = event.relativeDateTime
      this.endDateTime = 'now'
      this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)
      this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = event.absoluteDateTime.startDateTime
      this.endDateTime = event.absoluteDateTime.endDateTime
      this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)
      this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
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
    appId === 0 ? this.applicationId = null : this.applicationId = appId;
    this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
    this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)
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


  onHeatMapSelect(data: any) {

    const timeDiff = this.getTimeDiff()
    const dateTime = data.extra
    const date = dateTime.split(' ')[0].split('-');
    const time = dateTime.split(' ')[1].split(':');
    const startDateTime: Moment = moment().year(+date[2]).month(+date[1] - 1).date(+date[0]).hour(+time[0]).minute(
      +time[1]);

    this.startDateTime = startDateTime.format('YYYY-MM-DDTHH:mm') + ":00"
    this.endDateTime = startDateTime.add(timeDiff, 'minutes').format('YYYY-MM-DDTHH:mm') + ":00"

    this.loadHeatmapData(this.startDateTime, this.endDateTime, data.id)
    this.loadIncidentsTableData(this.startDateTime, this.endDateTime, data.id)
  }

  getTimeDiff() {
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

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
