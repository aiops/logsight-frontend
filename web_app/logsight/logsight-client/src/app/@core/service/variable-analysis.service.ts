import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VariableAnalysisService {
  constructor(private apiService: ApiService) {
  }

  loadData(applicationId: number, startTime: string, endTime: string, search: string | null = null) {
    let searchParam = ''
    if (search) {
      searchParam = `&search=${search}`
    }
    return this.apiService.get(
      `/api/variable-analysis/application/${applicationId}?startTime=${startTime}&endTime=${endTime}${searchParam}`)
  }

  loadSpecificTemplate(applicationId: number,
                       startTime: string, endTime: string,
                       item: { template: string; param: string; paramValue: string }): Observable<any> {
    return this.apiService.post(
      `/api/variable-analysis/application/${applicationId}/specific_template?startTime=${startTime}&endTime=${endTime}`,
      { template: item.template, param: item.param, paramValue: item.paramValue })
  }

  getLogCountLineChart(applicationId: number, startTime: string, endTime: string): Observable<any> {
    return this.apiService.get(
      `/api/variable-analysis/application/${applicationId}/log_count_line_chart?startTime=${startTime}&endTime=${endTime}`)
  }

  getTopNTemplates(applicationId: number, startTime: string, endTime: string,) {
    return this.apiService.get(
      `/api/variable-analysis/application/${applicationId}/top_n_templates?startTime=${startTime}&endTime=${endTime}`)
  }
}
