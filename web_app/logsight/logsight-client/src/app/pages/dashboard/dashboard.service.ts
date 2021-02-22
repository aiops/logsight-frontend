import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';

@Injectable()
export class DashboardService {
  constructor(private apiService: ApiService) {
  }

  loadLineChartData(): any {
    return this.apiService.get('/api/charts/line_chart');
  }

  loadHeatmapData() {
    return this.apiService.get('/api/charts/system_overview_heatmap');
  }

  loadPieChartData() {
    return this.apiService.get('/api/charts/log_level_advanced_pie_chart');
  }

  loadStackedChartData() {
    return this.apiService.get('/api/charts/log_level_stacked_line_chart');
  }

}
