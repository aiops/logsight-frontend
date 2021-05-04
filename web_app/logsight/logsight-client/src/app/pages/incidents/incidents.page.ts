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

@Component({
  selector: 'incidents',
  styleUrls: ['./incidents.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './incidents.page.html',
  encapsulation: ViewEncapsulation.None
})
export class IncidentsPage implements OnInit {

  constructor(private route: ActivatedRoute, private incidentsService: IncidentsService,
    private variableAnalysisService: VariableAnalysisService,
    private messagingService: MessagingService,
    private notificationService: NotificationsService,
    private dialogService: NbDialogService) {
  }

  // data = [{
  //   'key': 'data',
  //   'values': [{ x: 1613516400000, y: 9 }, { x: 1613602800000, y: 8 },
  //     { x: 1613689200000, y: 1 }]
  // }];
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
      if (dateTime) {
        this.loadIncidentsBarChart(dateTime, dateTime)
        this.loadIncidentsTableData(dateTime, dateTime)
      } else {
        this.loadIncidentsBarChart(this.relativeDateTime, 'now')
        this.loadIncidentsTableData(this.relativeDateTime, 'now')
      }
    });

    this.messagingService.getVariableAnalysisTemplate().subscribe(selected => {
      if (true) {
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
      console.log(resp)
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
