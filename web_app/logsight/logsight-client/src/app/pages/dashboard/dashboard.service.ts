import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';

@Injectable()
export class DashboardService {
  constructor(private apiService: ApiService) {
  }

  loadLineChartData(): any {
    return this.apiService.get('/api/charts/line_chart');
  }

}
