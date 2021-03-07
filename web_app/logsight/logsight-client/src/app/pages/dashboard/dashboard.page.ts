import { Component, OnInit, ViewChild } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { DashboardService } from './dashboard.service';
import { TopKIncident } from '../../@core/common/top-k-Incident';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  heatmapData = [];
  pieChartData = [];
  stackedChartData = [];
  topKIncidents: TopKIncident[] = [];
  options: any;
  themeSubscription: any;
  colorScheme: any;
  @ViewChild('myTable') table: any;

  constructor(private theme: NbThemeService, private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.loadHeatmapData()
    this.loadPieChartData()
    this.loadStackedAreaChartData()
    this.loadTopKIncidents()
  }

  loadHeatmapData() {
    this.dashboardService.loadHeatmapData().subscribe(data => {
      this.heatmapData = data.data;
    });
  }

  loadPieChartData() {
    this.dashboardService.loadPieChartData().subscribe(data => {
      this.pieChartData = data.data;
    });
  }

  loadStackedAreaChartData() {
    this.dashboardService.loadStackedChartData().subscribe(data => {
      this.stackedChartData = data.data;
    });
  }

  loadTopKIncidents() {
    this.topKIncidents = [];
    this.dashboardService.loadTopKIncidentsData().subscribe(data => {
      this.topKIncidents = data;
    });
  }

}
