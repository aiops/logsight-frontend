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
              console.log(err)
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

    this.loadPredefinedTimes();
  }

  loadPredefinedTimes() {
    this.dashboardService.findPredefinedTimes().subscribe(resp => this.predefinedTimes = resp)
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
          var date = moment.utc(data.data[i].name, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm');
          var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm');
          var local = moment(stillUtc, 'DD-MM-YYYY HH:mm').local().format('hh:mm A');
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
    console.log("AA", this.startDateTime, this.endDateTime)
    this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
    this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)
  }

  onDeletePredefinedTime(id: number) {
    this.dashboardService.deletePredefinedTime(id).subscribe(() => this.loadPredefinedTimes())
  }

  onSavePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.createPredefinedTime(predefinedTime).subscribe(resp => this.loadPredefinedTimes())
  }

  onSelectPredefinedTime(pt: PredefinedTime) {
    if (pt.dateTimeType == 'RELATIVE') {
      this.onDateTimeSearch({ relativeTimeChecked: true, relativeDateTime: pt.endTime })
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
}
