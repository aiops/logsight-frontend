import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VariableAnalysisService {
  constructor(private apiService: ApiService) {
  }

  loadData(applicationId: number, search: string | null = null) {
    let searchParam = ''
    if (search) {
      searchParam = `search=${search}`
    }
    return this.apiService.get(`/api/variable-analysis/application/${applicationId}?${searchParam}`)
  }

  loadSpecificTemplate(applicationId: number,
                       item: { template: string; param: string; paramValue: string }): Observable<any> {
    return this.apiService.post(
      `/api/variable-analysis/application/${applicationId}/specific_template`,
      { template: item.template, param: item.param, paramValue: item.paramValue })
  }

  getLogCountLineChart(applicationId: number): Observable<any> {
    return this.apiService.get(`/api/variable-analysis/application/${applicationId}/log_count_line_chart`)
  }

  getTopNTemplates(applicationId: number) {
    return this.apiService.get(`/api/variable-analysis/application/${applicationId}/top_n_templates`)
  }
}
