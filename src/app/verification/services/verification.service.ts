import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Status} from '../models/status.enum';
import {TagRequest} from "../../@core/common/TagRequest";
import {
  IssuesKPIVerificationRequest,
  UpdateVerificationStatusRequest,
  VerificationRequest
} from "../../@core/common/verification-request";
import {ChartRequest} from "../../@core/common/chart-request";
import {ApiService} from "../../@core/service/api.service";
import {OverviewVerificationData} from "../../@core/common/verification-data";

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  getOverview(): Observable<any> {
    return this.apiService.get(`/api/v1/logs/compare`);
  }

  changeStatus(request: UpdateVerificationStatusRequest) {
    return this.apiService.post(`/api/v1/logs/compare/status`, request);
  }

  delete(compareId: string) {
    return this.apiService.delete(`/api/v1/logs/compare/${compareId}`);
  }

  loadAvailableTagKeys(tagRequest: TagRequest): Observable<any> {
    return this.apiService.post(`/api/v1/logs/tags/filter`, tagRequest);
  }

  loadTagValueForKey(tagKey: string): Observable<any> {
    return this.apiService.post(`/api/v1/logs/tags/values`, tagKey);
  }

  loadVerificationByID(compareId: string): Observable<any> {
    let parameter = ""
    if (compareId) {
      parameter = `compareId=${compareId}`
    }
    return this.apiService.get(`/api/v1/logs/compare?${parameter}`);
  }

  createVerification(verificationRequest: VerificationRequest) {
    return this.apiService.post(`/api/v1/logs/compare`, verificationRequest);
  }

  loadIssuesKPI(issuesKPIVerificationRequest: IssuesKPIVerificationRequest){
    return this.apiService.post(`/api/v1/logs/compare/issues`, issuesKPIVerificationRequest);
  }


  loadBarData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/barchart`, chartRequest);
  }

}
