import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class IncidentsService {
  constructor(private apiService: ApiService) {
  }

  loadIncidentsBarChart(startTime: string, endTime: string | null, relativeSearch = false): Observable<any> {
    const endTimeParam = endTime ? `&endTime=${endTime}` : ''
    return this.apiService.get(
      `/api/incidents/bar_chart_data?startTime=${startTime}${endTimeParam}&relativeSearch=${relativeSearch}`);
  }

  loadIncidentsTableData(startTime: string, endTime: string): Observable<any> {
    return this.apiService.get(`/api/incidents/table_data?startTime=${startTime}&endTime=${endTime}`);
  }
}
