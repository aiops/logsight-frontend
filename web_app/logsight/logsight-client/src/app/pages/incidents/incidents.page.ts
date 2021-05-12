import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentsService } from './incidents.service';
import { options } from './chart-options';
import { IncidentTableData } from '../../@core/common/incident-table-data';
import 'd3';
import 'nvd3';
import { Observable } from 'rxjs';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { MessagingService } from '../../@core/service/messaging.service';
import { NotificationsService } from 'angular2-notifications';
import { NbDialogService } from '@nebular/theme';
import * as moment from 'moment'
import { Moment } from 'moment';
import {start} from "repl";
import {query} from "@angular/animations";

@Component({
  selector: 'incidents',
  styleUrls: ['./incidents.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './incidents.page.html',
  encapsulation: ViewEncapsulation.None
})
export class IncidentsPage implements OnInit {

  constructor(private route: ActivatedRoute,
              private incidentsService: IncidentsService,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService) {
  }

  relativeTimeChecked = true;
  absoluteTimeChecked = false;

  chartData = [];
  tableData: IncidentTableData;
  options = options.timelineChart()
  absoluteDateTime: { startDateTime: Date, endDateTime: Date }
  relativeDateTime: string = 'now-12h';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const dateTime = queryParams.get('startTime')
      const endTime = queryParams.get('endTime')
      const applicationId = queryParams.get('applicationId') //TODO send the applicationId
      if (dateTime && endTime) {
        const startDateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm:ss.sss');
        const endDateTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss.sss');
        this.loadIncidentsBarChart(startDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'), endDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'))
        this.loadIncidentsTableData(startDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'), endDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'))
      } else if(dateTime && !endTime){
        var startDateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm:ss.sss');
        this.loadIncidentsBarChart(dateTime,
          startDateTime.add(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sss'))
        var startDateTime = moment(dateTime, 'YYYY-MM-DDTHH:mm:ss.sss');
        this.loadIncidentsTableData(dateTime,
          startDateTime.add(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sss'))
      } else {
        this.loadIncidentsBarChart(this.relativeDateTime, 'now')
        this.loadIncidentsTableData(this.relativeDateTime, 'now')
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

  private loadIncidentsBarChart(startTime: string, endTime: string) {
    this.incidentsService.loadIncidentsBarChart(startTime, endTime).subscribe(resp => {
      this.chartData = resp
    })
  }

  private loadIncidentsTableData(startTime: string, endTime: string) {
    this.incidentsService.loadIncidentsTableData(startTime, endTime).subscribe(resp => {
      this.tableData = resp
    })
  }

  onAbsoluteDateChange(dateRange: { startDateTime: Date, endDateTime: Date }) {
    this.absoluteDateTime = dateRange
  }

  onRelativeDateChange(value) {
    this.relativeDateTime = value;
  }

  onRelativeTimeChecked(checked) {
    if (checked) {
      this.absoluteTimeChecked = false;
    }
  }

  onAbsoluteTimeChecked(checked) {
    if (checked) {
      this.relativeTimeChecked = false;
    }
  }

  search() {
    if (this.relativeTimeChecked) {
      this.loadIncidentsBarChart(this.relativeDateTime, 'now')
      this.loadIncidentsTableData(this.relativeDateTime, 'now')
    } else if (this.absoluteDateTime) {
      this.loadIncidentsBarChart(
        this.absoluteDateTime.startDateTime.toISOString(),
        this.absoluteDateTime.endDateTime.toISOString())
      this.loadIncidentsTableData(
        this.absoluteDateTime.startDateTime.toISOString(),
        this.absoluteDateTime.endDateTime.toISOString())
    }
  }

}
