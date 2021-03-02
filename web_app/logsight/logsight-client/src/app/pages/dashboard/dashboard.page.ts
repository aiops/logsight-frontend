import { Component, OnInit, ViewChild } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  heatmapData = [];
  pieChartData = [];
  stackedChartData = [];
  topKIncidents = [
    {
      "id": 0,
      "name": "Ramsey Cummings",
      "gender": "male",
      "age": 52,
      "address": {
        "state": "South Carolina",
        "city": "Glendale"
      }
    },
    {
      "id": 1,
      "name": "Stefanie Huff",
      "gender": "female",
      "age": 70,
      "address": {
        "state": "Arizona",
        "city": "Beaverdale"
      }
    },
    {
      "id": 2,
      "name": "Mabel David",
      "gender": "female",
      "age": 52,
      "address": {
        "state": "New Mexico",
        "city": "Grazierville"
      }
    },
    {
      "id": 3,
      "name": "Frank Bradford",
      "gender": "male",
      "age": 61,
      "address": {
        "state": "Wisconsin",
        "city": "Saranap"
      }
    }];
  options: any;
  themeSubscription: any;
  colorScheme: any;
  @ViewChild('myTable') table: any;

  constructor(private theme: NbThemeService, private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.loadHeatmapData()
    this.loadPieChartData()
    // this.loadStackedAreaChartData()
    // this.loadTopKIncidents()
  }

  loadHeatmapData() {
    this.dashboardService.loadHeatmapData().subscribe(data => {
      console.log(data, 'from loadHeatmapData')
      this.heatmapData = data.data;
    });
  }

  loadPieChartData() {
    this.dashboardService.loadPieChartData().subscribe(data => {
      console.log(data.data, 'from loadPieChartData')
      this.pieChartData = data.data;
    });
  }

  loadStackedAreaChartData() {
    this.dashboardService.loadStackedChartData().subscribe(data => {
      console.log(data.data, 'from loadStackedAreaChartData')
      this.stackedChartData = data.data;
    });
  }

  loadTopKIncidents() {
    this.topKIncidents = [];
    this.dashboardService.loadTopKIncidentsData().subscribe(data => {
      console.log(data, 'from loadTopKIncidents')
      this.topKIncidents = data;
    });
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
}
