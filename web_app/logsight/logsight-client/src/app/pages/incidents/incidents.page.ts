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
import { retry, share, switchMap, takeUntil } from 'rxjs/operators';
import { DashboardService } from '../dashboard/dashboard.service';

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

  constructor(private route: ActivatedRoute,
              private incidentsService: IncidentsService,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService,
              private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const dateTime = queryParams.get('startTime')
      const endTime = queryParams.get('endTime')
      const applicationId = queryParams.get('applicationId') //TODO send the applicationId
      if (dateTime && endTime) {
        const startDateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm:ss.sss');
        const endDateTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss.sss');
        this.loadIncidentsTableData(startDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'),
          endDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'))
        this.loadHeatmapData(startDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'),
          endDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'))
      } else if (dateTime && !endTime) {
        let startDateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm:ss.sss');
        this.loadIncidentsTableData(dateTime, startDateTime.add(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sss'))
        this.loadHeatmapData(dateTime, startDateTime.add(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sss'))
      } else {
        this.loadIncidentsTableData('now-12h', 'now')  // TODO heatmap with the times
        this.loadHeatmapData('now-12h', 'now')
      }
    });

    this.messagingService.getVariableAnalysisTemplate().subscribe(selected => {
      if (true) { //if selectedApplication and change 1
        this.variableAnalysisService.loadSpecificTemplate(1, selected['item']).subscribe(
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
  }

  private loadIncidentsTableData(startTime: string, endTime: string) {
    this.incidentsService.loadIncidentsTableData(startTime, endTime).subscribe(resp => {
      this.tableData = resp
    })
  }

  loadHeatmapData(startTime: string, endTime: string) {
    return this.dashboardService.loadHeatmapData(startTime, endTime).subscribe(data => this.heatmapData = data.data)
  }

  onDateTimeSearch(event) {
    this.popover.hide();
    this.openDatePicker = false;
    if (event.relativeTimeChecked) {
      this.loadHeatmapData(event.relativeDateTime, 'now')
      this.loadIncidentsTableData(event.relativeDateTime, 'now')
    } else if (event.absoluteTimeChecked) {
      this.loadHeatmapData(
        event.absoluteDateTime.startDateTime.toISOString(),
        event.absoluteDateTime.endDateTime.toISOString())
      this.loadIncidentsTableData(
        event.absoluteDateTime.startDateTime.toISOString(),
        event.absoluteDateTime.endDateTime.toISOString())
    }
  }

  openPopover() {
    this.popover.show();
    this.openDatePicker = !this.openDatePicker
    if (!this.openDatePicker) {
      this.popover.hide();
    }
  }

}
