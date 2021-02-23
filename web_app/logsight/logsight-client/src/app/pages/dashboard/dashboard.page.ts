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
    // this.loadStackedAreaChartData()
  }

  loadHeatmapData() {
    this.dashboardService.loadHeatmapData().subscribe(data => {
      console.log(data, "from loadHeatmapData")
      this.heatmapData = data.data;
    });
  }

  loadPieChartData() {
    this.dashboardService.loadPieChartData().subscribe(data => {
      console.log(data.data, "from loadPieChartData")
      this.pieChartData = data.data;
    });
  }

  loadStackedAreaChartData() {
    this.dashboardService.loadStackedChartData().subscribe(data => {
      console.log(data.data, "from loadStackedAreaChartData")
      this.stackedChartData = data.data;
    });
  }
}
