import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TagRequest, TagValueRequest} from "../../@core/common/TagRequest";
import {IssuesKPIVerificationRequest, VerificationRequest} from "../../@core/common/verification-request";
import {ChartRequest} from "../../@core/common/chart-request";
import {ApiService} from "../../@core/service/api.service";
import {GetIncidentOverviewRequest, UpdateIncidentStatusRequest} from "../../@core/common/incident-request";

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  getOverview(startTime: string, stopTime: string): Observable<any> {
    return this.apiService.post(`/api/v1/logs/incidents/grouped`, new GetIncidentOverviewRequest(startTime, stopTime));
  }

  getOverviewIncidents(startTime: string, stopTime: string): Observable<any> {
    return this.apiService.post(`/api/v1/logs/incidents`, new GetIncidentOverviewRequest(startTime, stopTime));
  }

  changeStatus(request: UpdateIncidentStatusRequest) {
    return this.apiService.put(`/api/v1/logs/incidents/${request.incident.incidentId}`, request);
  }

  delete(incidentId: string) {
    return this.apiService.delete(`/api/v1/logs/incidents/${incidentId}`);
  }

  loadAvailableTagKeys(tagRequest: TagRequest): Observable<any> {
    return this.apiService.post(`/api/v1/logs/tags/filter`, tagRequest);
  }

  loadTagValueForKey(tagValueRequest: TagValueRequest): Observable<any> {
    return this.apiService.post(`/api/v1/logs/tags/values`, tagValueRequest);
  }

  loadIncidentByID(incidentId: string): Observable<any> {
    return this.apiService.get(`/api/v1/logs/incidents/${incidentId}`);
  }

  createVerification(verificationRequest: VerificationRequest) {
    return this.apiService.post(`/api/v1/logs/incidents`, verificationRequest);
  }

  loadIssuesKPI(userId: string, issuesKPIVerificationRequest: IssuesKPIVerificationRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/map`, issuesKPIVerificationRequest);
  }


  loadBarData(userId: string, chartRequest: ChartRequest) {
    return this.apiService.post(`/api/v1/users/${userId}/charts/barchart`, chartRequest);
  }

}
