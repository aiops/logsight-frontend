import {
  Component,
  OnInit, TemplateRef, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'incidents',
  styleUrls: ['./incidents.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './incidents.page.html',
  encapsulation: ViewEncapsulation.None
})
export class IncidentsPage implements OnInit {
  heatmapData = [];
  tableData: IncidentTableData;
  options = options.timelineChart()
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  openDatePicker = false;
  applicationId: number;
  applications: Application[] = [];
  startDateTime = 'now-12h';
  endDateTime = 'now'

  constructor(private route: ActivatedRoute,
              private incidentsService: IncidentsService,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService,
              private dashboardService: DashboardService,
              private authService: AuthenticationService,
              private integrationService: IntegrationService) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const dateTime = queryParams.get('startTime')
      const endTime = queryParams.get('endTime')
      const applicationParam = queryParams.get('applicationId') //TODO send the applicationId
      this.applicationId = applicationParam ? +applicationParam : null
      if (dateTime && endTime) {
        this.startDateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
        this.endDateTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');

        this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
        this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)
      } else {
        this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
        this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)
      }
    });

    this.messagingService.getVariableAnalysisTemplate()
      .pipe(map(it => it['item']))
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
        // this.applicationId = this.applications[0].id;
        this.applicationSelected(this.applicationId);
      }
    })
  }

  private loadIncidentsTableData(startTime: string, endTime: string, applicationId: number | null) {
    this.incidentsService.loadIncidentsTableData(startTime, endTime, applicationId).subscribe(resp => {
      this.tableData = resp
    })
  }

  loadHeatmapData(startTime: string, endTime: string, applicationId: number | null) {
    return this.dashboardService.loadHeatmapData(startTime, endTime, applicationId).subscribe(
      data => this.heatmapData = data.data)
  }

  onDateTimeSearch(event) {
    this.popover.hide();
    this.openDatePicker = false;
    if (event.relativeTimeChecked) {
      this.startDateTime = event.relativeDateTime
      this.endDateTime = 'now'
      this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)
      this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = event.absoluteDateTime.startDateTime.toISOString()
      this.endDateTime = event.absoluteDateTime.endDateTime.toISOString()
      this.loadHeatmapData(this.startDateTime, this.endDateTime, this.applicationId)
      this.loadIncidentsTableData(this.startDateTime, this.endDateTime, this.applicationId)
    }
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

}
