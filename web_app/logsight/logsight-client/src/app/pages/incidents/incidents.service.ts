import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class IncidentsService {
  constructor(private apiService: ApiService) {
  }

  loadIncidentsBarChart(startTime: string, endTime: string): Observable<any> {
    return this.apiService.get(
      `/api/incidents/bar_chart_data?startTime=${startTime}&endTime=${endTime}`);
  }

  loadIncidentsTableData(startTime: string, endTime: string, applicationId: number | null): Observable<any> {
    let applicationParam = '';
    if (applicationId) {
      applicationParam = `&applicationId=${applicationId}`
    }
    return this.apiService.get(`/api/incidents/table_data?startTime=${startTime}&endTime=${endTime}${applicationParam}`);
  }
}
