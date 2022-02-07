import {Injectable} from '@angular/core';
import {ApiService} from '../../@core/service/api.service';
import {Observable} from 'rxjs/Observable';
import {PredefinedTime} from '../../@core/common/predefined-time';
import {ChartRequest} from "../../@core/common/chart-request";
import {PredefinedTimeList} from "../../@core/common/predefined-time-list";

@Injectable()
export class DashboardService {
  constructor(private apiService: ApiService) {
  }

  loadHeatmapData(chartRequest: ChartRequest) {
    return this.apiService.post(
      `/api/v1/charts/heatmap`, chartRequest);
  }

  loadBarData(chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/charts/barchart`, chartRequest);
  }

  loadPieChartData(chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/charts/piechart`, chartRequest);
  }

  loadTopKIncidentsData(chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/charts/tablechart`, chartRequest);
  }

  getAllTimeRanges(): Observable<PredefinedTimeList> {
    return this.apiService.get(`/api/v1/time_ranges`);
  }

  deleteTimeRange(predefinedTime: PredefinedTime) {
    return this.apiService.delete(`/api/v1/time_ranges/${predefinedTime.id}`);
  }

  createTimeRange(predefinedTime: PredefinedTime) {
    return this.apiService.post(`/api/v1/time_ranges`, predefinedTime);
  }
}
