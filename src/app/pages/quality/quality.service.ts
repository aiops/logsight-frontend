import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import {Observable} from "rxjs";

@Injectable()
export class QualityService {
  constructor(private apiService: ApiService) {
  }

    loadIncidentsTableData(startTime: string, endTime: string, applicationId: number | null): Observable<any> {
    let applicationParam = '';
    if (applicationId) {
      applicationParam = `&applicationId=${applicationId}`
    }
    return this.apiService.get(`/api/quality/gauge_data?startTime=${startTime}&endTime=${endTime}${applicationParam}`);
  }
}
