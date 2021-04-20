import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentsService } from './incidents.service';
import { options } from './chart-options';

@Component({
  selector: 'incidents',
  styleUrls: ['./incidents.page.scss'],
  templateUrl: './incidents.page.html',
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
  tableData = [];
  options = options.timelineChart()

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (!changes.data.isFirstChange()) {
  //     this.setEventListener();
  //   }
  // }
  //
  // setEventListener() {
  //   const focus = this.chart.chart.focus;
  //   focus.dispatch.on('onBrush', extent => {
  //     const [start, end] = extent;
  //     this.onRangeChange.next([moment(start), moment(end)]);
  //   });
  // }

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
