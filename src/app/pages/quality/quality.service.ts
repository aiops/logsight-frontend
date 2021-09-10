import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import {Observable} from "rxjs";

@Injectable()
export class QualityService {
  constructor(private apiService: ApiService) {
  }

    loadQualityData(startTime: string, endTime: string, applicationId: number | null): Observable<any> {
    console.log("AAAA", applicationId)
    let applicationParam = '';
    if (applicationId) {
      applicationParam = `&applicationId=${applicationId}`
    }

    return this.apiService.get(`/api/quality/overall_quality?startTime=${startTime}&endTime=${endTime}${applicationParam}`);
  }

  loadQualityOverview(startTime: string, endTime: string, applicationId: number | null): Observable<any> {
    let applicationParam = '';
    if (applicationId) {
      applicationParam = `&applicationId=${applicationId}`
    }
    return this.apiService.get(`/api/quality/overall_quality_overview?startTime=${startTime}&endTime=${endTime}${applicationParam}`);
  }

  computeLogQuality(startTime: string, endTime: string): Observable<any> {
    return this.apiService.get(`/api/quality/compute_log_quality?startTime=${startTime}&endTime=${endTime}`);
  }

}
