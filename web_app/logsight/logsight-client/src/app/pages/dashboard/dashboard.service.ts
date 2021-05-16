import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';

@Injectable()
export class DashboardService {
  constructor(private apiService: ApiService) {
  }

  loadHeatmapData(startTime: string, endTime: string) {
    return this.apiService.get(`/api/charts/system_overview_heatmap?startTime=${startTime}&endTime=${endTime}`);
  }

  loadBarData(startTime: string, endTime: string) {
    return this.apiService.get(`/api/charts/dashboard_bar_anomalies?startTime=${startTime}&endTime=${endTime}`);
  }

  loadPieChartData(startTime: string, endTime: string) {
    return this.apiService.get(`/api/charts/log_level_advanced_pie_chart?startTime=${startTime}&endTime=${endTime}`);
  }

  loadStackedChartData(startTime: string, endTime: string) {
    return this.apiService.get(`/api/charts/log_level_stacked_line_chart?startTime=${startTime}&endTime=${endTime}`);
  }

  loadTopKIncidentsData(startTime: string, endTime: string) {
    return this.apiService.get(`/api/incidents/top_k_incidents?startTime=${startTime}&endTime=${endTime}`);
  }
}
