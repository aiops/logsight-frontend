import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import { Observable } from 'rxjs/Observable';
import { PredefinedTime } from '../../@core/common/predefined-time';

@Injectable()
export class DashboardService {
  constructor(private apiService: ApiService) {
  }

  loadHeatmapData(startTime: string, endTime: string, applicationId: number | null) {
    let applicationParam = '';
    if (applicationId) {
      applicationParam = `&applicationId=${applicationId}`
    }
    return this.apiService.get(
      `/api/charts/system_overview_heatmap?startTime=${startTime}&endTime=${endTime}${applicationParam}`);
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

  findPredefinedTimes(): Observable<PredefinedTime[]> {
    return this.apiService.get(`/api/applications//user/predefined_times`);
  }

  deletePredefinedTime(id: number) {
    return this.apiService.delete(`/api/applications/user/predefined_times/${id}`);
  }

  createPredefinedTime(predefinedTime: PredefinedTime) {
    return this.apiService.post(`/api/applications/user/predefined_times`, predefinedTime);
  }
}
