import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

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
}
