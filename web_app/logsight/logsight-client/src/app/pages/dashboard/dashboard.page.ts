import { Component, OnInit, ViewChild } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { DashboardService } from './dashboard.service';
import { TopKIncident } from '../../@core/common/top-k-Incident';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  heatmapData = [];
  pieChartData = [];
  stackedChartData = [];
  barData = [];
  topKIncidents: TopKIncident[] = [];

  constructor(private dashboardService: DashboardService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadHeatmapData()
    this.loadPieChartData()
    this.loadStackedAreaChartData()
    this.loadTopKIncidents()
    this.loadBarData()
  }

  loadHeatmapData() {
    this.dashboardService.loadHeatmapData().subscribe(data => {
      this.heatmapData = data.data;
    });
  }

  loadBarData() {
    this.dashboardService.loadBarData().subscribe(data => {
      this.barData = data;
      console.log(data)
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

  onHeatMapSelect(data: any) {
    this.router.navigate(['/pages', 'incidents'], { queryParams: { 'startTime': data.series } })
  }

}
