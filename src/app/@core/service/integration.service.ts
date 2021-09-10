import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Application } from '../common/application';
import {LogFileType} from "../common/log-file-type";

@Injectable()
export class IntegrationService {
  constructor(private apiService: ApiService) {
  }

  createApplication(app: { name: string; key: string }): Observable<Application> {
    return this.apiService.post('/api/applications/create', app)
  }

  createDemoApplications(): Observable<String> {
    return this.apiService.post('/api/applications/create/demo_apps', null)
  }

  loadApplications(key: string): Observable<Application[]> {
    return this.apiService.get(`/api/applications/user/${key}`)
  }

  deleteApplication(id: number) {
    return this.apiService.post(`/api/applications/${id}`, null)
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
