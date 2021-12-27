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

  loadBarData(startTime: string, endTime: string, applicationId: number) {
    let applicationParam = '';
    if (applicationId) {
      applicationParam = `&applicationId=${applicationId}`
    }
    return this.apiService.get(`/api/charts/dashboard_bar_anomalies?startTime=${startTime}&endTime=${endTime}${applicationParam}`);
  }

  loadPieChartData(startTime: string, endTime: string, applicationId: number) {
    let applicationParam = '';
    if (applicationId) {
      applicationParam = `&applicationId=${applicationId}`
    }

    return this.apiService.get(`/api/charts/log_level_advanced_pie_chart?startTime=${startTime}&endTime=${endTime}${applicationParam}`);
  }

  loadStackedChartData(startTime: string, endTime: string) {
    return this.apiService.get(`/api/charts/log_level_stacked_line_chart?startTime=${startTime}&endTime=${endTime}`);
  }

  loadTopKIncidentsData(startTime: string, endTime: string, numberOfIncidents: number, applicationId: number) {
    let applicationParam = '';
    if (applicationId) {
      applicationParam = `&applicationId=${applicationId}`
    }

    return this.apiService.get(`/api/incidents/top_k_incidents?startTime=${startTime}&endTime=${endTime}&numberOfIncidents=${numberOfIncidents}${applicationParam}`);
  }

  getAllTimeRanges(): Observable<PredefinedTime[]> {
    return this.apiService.get(`/api/user/time_ranges`);
  }

  deleteTimeRange(predefinedTime: PredefinedTime) {
    return this.apiService.post(`/api/user/time_ranges/range/delete`, predefinedTime);
  }

  createTimeRange(predefinedTime: PredefinedTime) {
    return this.apiService.post(`/api/user/time_ranges/range`, predefinedTime);
  }

  createPredefinedTimeRange() {
    return this.apiService.post(`/api/user/time_ranges/predefined`, null);
  }
}
