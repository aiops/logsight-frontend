import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Application } from '../common/application';
import {LogFileType} from "../common/log-file-type";
import {ApplicationList} from "../common/applicationList";

@Injectable()
export class IntegrationService {
  constructor(private apiService: ApiService) {
  }

  createApplication(userId: string, app: { applicationName: string }): Observable<Application> {
    return this.apiService.post(`/api/v1/users/${userId}/applications`, app)
  }

  // createDemoApplications(): Observable<String> {
  //   return this.apiService.post('/api/v1/applications/', null)
  // }

  loadApplications(userId: string): Observable<ApplicationList> {
    return this.apiService.get(`/api/v1/users/${userId}/applications`)
  }

  deleteApplication(userId: string, id: string) {
    return this.apiService.delete(`/api/v1/users/${userId}/applications/${id}`)
  }

  subscription(payment: any) {
    return this.apiService.post(`/api/payments`, payment)
  }

  checkCustomerPortal() {
    return this.apiService.post(`/api/payments/customer_portal`, { 'body': 'empty' })
  }

  loadLogFileTypes(): Observable<LogFileType[]> {
    return this.apiService.get(`/api/applications/logFileFormats`)
  }
}
