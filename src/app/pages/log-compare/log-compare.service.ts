import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import {Observable} from "rxjs";
import {ChartRequest} from "../../@core/common/chart-request";
import {VerificationRequest} from "../../@core/common/verification-request";
import {TagRequest} from "../../@core/common/TagRequest";

@Injectable()
export class LogCompareService {
  constructor(private apiService: ApiService) {
  }

  loadAvailableTagKeys(tagRequest: TagRequest): Observable<any> {
    return this.apiService.post(`/api/v1/logs/tags/filter`, tagRequest);
  }

  loadTagValueForKey(tagKey: string): Observable<any> {
    return this.apiService.post(`/api/v1/logs/tags/values`, tagKey);
  }

  computeLogCompare(verificationRequest: VerificationRequest){
    return this.apiService.post(`/api/v1/logs/compare/view`, verificationRequest);
  }


  loadBarData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/barchart`, chartRequest);
  }



}
