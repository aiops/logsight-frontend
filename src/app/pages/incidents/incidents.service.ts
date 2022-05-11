import {Injectable} from '@angular/core';
import {ApiService} from '../../@core/service/api.service';
import {Observable} from 'rxjs';
import {ChartRequest} from "../../@core/common/chart-request";

@Injectable()
export class IncidentsService {
  constructor(private apiService: ApiService) {
  }

  loadIncidentsTableData(userId: string, chartRequest: ChartRequest): Observable<any> {
    return this.apiService.post(`/api/v1/users/${userId}/charts/tablechart`, chartRequest);
  }
}
