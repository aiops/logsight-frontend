import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentsService } from './incidents.service';
import { options } from './chart-options';

@Component({
  selector: 'incidents',
  styleUrls: ['./incidents.component.scss'],
  templateUrl: './incidents.component.html',
})
export class IncidentsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private incidentsService: IncidentsService) {
  }

  data = [{
    'key': 'data',
    'values': [{ x: 1613516400000, y: 9, series: 0 }, { x: 1613602800000, y: 8, series: 0 },
      { x: 1613689200000, y: 1, series: 0 }]
  }];

  options = options.timelineChart()

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      console.log('vleze')
      const dateTime = queryParams.get('startTime')
      this.loadIncidentsBarChart(dateTime, dateTime)
    });
  }

  private loadIncidentsBarChart(startTime: string, endTime: string) {
    this.incidentsService.loadIncidentsBarChart(startTime, endTime).subscribe(resp => console.log(resp))
  }
}
