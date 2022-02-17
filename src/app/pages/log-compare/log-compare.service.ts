import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import {Observable} from "rxjs";
import {ChartRequest} from "../../@core/common/chart-request";
import {VerificationRequest} from "../../@core/common/verification-request";

@Injectable()
export class LogCompareService {
  constructor(private apiService: ApiService) {
  }

  loadApplicationVersions(userId: string, applicationId: string): Observable<any> {
    let applicationParam = '';
    let userParam = '';
    if (applicationId) {
      applicationParam = `applicationId=${applicationId}`
      userParam = `&userId=${userId}`
    }
    return this.apiService.get(`/api/v1/compare/versions?${applicationParam}${userParam}`);
  }

  computeLogCompare(verificationRequest: VerificationRequest){
    return this.apiService.post(`/api/v1/compare/view`, verificationRequest);
  }


  loadBarData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/barchart`, chartRequest);
  }



}
