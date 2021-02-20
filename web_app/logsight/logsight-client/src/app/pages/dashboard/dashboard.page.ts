import { Component, OnInit } from '@angular/core';
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
  options: any;
  themeSubscription: any;
  colorScheme: any;

  constructor(private theme: NbThemeService, private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.loadHeatmapData()
    this.loadPieChartData()
    this.loadStackedAreaChartData()
  }

  loadHeatmapData() {
    this.dashboardService.loadHeatmapData().subscribe(data => {
      this.heatmapData = data;
    });
  }

  loadPieChartData() {
    this.dashboardService.loadPieChartData().subscribe(data => {
      this.pieChartData = data;
    });
  }

  loadStackedAreaChartData() {
    this.dashboardService.loadStackedChartData().subscribe(data => {
      this.stackedChartData = data;
    });
  }
}
