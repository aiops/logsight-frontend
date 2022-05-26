import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Status} from '../models/status.enum';
import {TagRequest} from "../../@core/common/TagRequest";
import {VerificationRequest} from "../../@core/common/verification-request";
import {ChartRequest} from "../../@core/common/chart-request";
import {ApiService} from "../../@core/service/api.service";
import {OverviewVerificationData} from "../../@core/common/verification-data";

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  getOverview(): Observable<OverviewVerificationData[]> {
    return this.apiService.get(`/api/v1/logs/compare`);
  }

  changeStatus(id: string, status: Status) {
    return of({});
  }

  delete(ids: string[]) {
    return of({});
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

  computeLogCompare(verificationRequest: VerificationRequest) {
    return this.apiService.post(`/api/v1/logs/compare/view`, verificationRequest);
  }


  loadBarData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/barchart`, chartRequest);
  }

}
