import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {TagRequest, TagValueRequest} from "../../@core/common/TagRequest";
import {
  IssuesKPIVerificationRequest,
  UpdateVerificationStatusRequest,
  VerificationRequest
} from "../../@core/common/verification-request";
import {ChartRequest} from "../../@core/common/chart-request";
import {ApiService} from "../../@core/service/api.service";
import { map } from 'rxjs/operators';
import { mapOverview } from '../mapping/overview.mapping';
import { OverviewItem } from '../models/overview.model';
import { mapAnalytics } from '../mapping/analytics.mapping';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  getOverview(startDateTime, endDateTime): Observable<OverviewItem[]> {
    return this.apiService.get(`/api/v1/logs/compare?startTime=${startDateTime}&stopTime=${endDateTime}`).pipe(
      map(mapOverview)
    );
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

  loadTagValueForKey(tagValueRequest: TagValueRequest): Observable<any> {
    return this.apiService.post(`/api/v1/logs/tags/values`, tagValueRequest);
  }

  loadVerificationByID(compareId: string): Observable<any> {
    return this.apiService.get(`/api/v1/logs/compare/${compareId}`);
  }

  createVerification(verificationRequest: VerificationRequest) {
    return this.apiService.post(`/api/v1/logs/compare`, verificationRequest);
  }

  loadIssuesKPI(userId: string, issuesKPIVerificationRequest: IssuesKPIVerificationRequest){
    return this.apiService.post(`/api/v1/users/${userId}/charts/map`, issuesKPIVerificationRequest);
  }

  loadBarData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/barchart`, chartRequest).pipe(
      map(mapAnalytics)
    );
  }
}
