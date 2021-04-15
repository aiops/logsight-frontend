import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';

@Injectable()
export class IncidentsService {
  constructor(private apiService: ApiService) {
  }

  loadIncidentsBarChart(startTime: string, endTime: any) {
    return this.apiService.get(`/api/incidents/bar_chart_data?startTime=${startTime}&endTime=${endTime}`);
  }
}
