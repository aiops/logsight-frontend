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

@Component({
  selector: 'incidents',
  styleUrls: ['./incidents.page.scss', '../../../../node_modules/nvd3/build/nv.d3.min.css'],
  templateUrl: './incidents.page.html',
  encapsulation: ViewEncapsulation.None
})
export class IncidentsPage implements OnInit {

  constructor(private route: ActivatedRoute, private incidentsService: IncidentsService) {
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
  relativeDateTime: string = 'now-12H';

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
