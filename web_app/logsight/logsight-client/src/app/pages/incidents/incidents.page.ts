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
  chartData = [];
  tableData: IncidentTableData;
  options = options.timelineChart()

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const dateTime = queryParams.get('startTime')
      this.loadIncidentsBarChart(dateTime, dateTime)
      this.loadIncidentsTableData(dateTime, dateTime)
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
      console.log('this.tableData', this.tableData)
    })
  }
}
