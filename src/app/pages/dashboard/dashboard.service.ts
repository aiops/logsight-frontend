import {Injectable} from '@angular/core';
import {ApiService} from '../../@core/service/api.service';
import {Observable} from 'rxjs/Observable';
import {PredefinedTime} from '../../@core/common/predefined-time';
import {ChartRequest} from "../../@core/common/chart-request";
import {PredefinedTimeList} from "../../@core/common/predefined-time-list";
import {userInfo} from "os";

@Injectable()
export class DashboardService {
  constructor(private apiService: ApiService) {
  }

  loadHeatmapData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(
      `/api/v1/users/${userId}/charts/heatmap`, chartRequest);
  }

  loadBarData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/barchart`, chartRequest);
  }

  loadPieChartData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/piechart`, chartRequest);
  }

  loadTopKIncidentsData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/tablechart`, chartRequest);
  }

  getAllTimeRanges(userId: string): Observable<PredefinedTimeList> {
    return this.apiService.get(`/api/v1/users/${userId}/time_ranges`);
  }

  deleteTimeRange(userId: string, predefinedTime: PredefinedTime) {
    return this.apiService.delete(`/api/v1/users/${userId}/time_ranges/${predefinedTime.id}`);
  }

  createTimeRange(userId: string, predefinedTime: PredefinedTime) {
    return this.apiService.post(`/api/v1/users/${userId}/time_ranges`, predefinedTime);
  }
}
