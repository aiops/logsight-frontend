import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import { Application } from '../../@core/common/application';
import { Observable } from 'rxjs';

@Injectable()
export class IntegrationService {
  constructor(private apiService: ApiService) {
  }

  createApplication(app: { name: string; key: string }): Observable<Application> {
    return this.apiService.post('/api/applications', app)
  }
}
