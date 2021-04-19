import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Application } from '../common/application';

@Injectable()
export class IntegrationService {
  constructor(private apiService: ApiService) {
  }

  createApplication(app: { name: string; key: string }): Observable<Application> {
    return this.apiService.post('/api/applications', app)
  }

  loadApplications(key: string): Observable<Application[]> {
    return this.apiService.get(`/api/applications/user/${key}`)
  }
}
