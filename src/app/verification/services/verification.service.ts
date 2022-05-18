import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { overviewData } from '../fake-data/overview';
import { OverviewItem } from '../models/overview.model';
import { PaginationData } from '../models/pagination.model';
import { Status } from '../models/status.enum';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http: HttpClient) { }

  getOverview(): Observable<OverviewItem[]> {
    return of(overviewData);
  }

  changeStatus(id: string, status: Status) {
    return of({});
  }

  delete(ids: string[]) {
    return of({});
  }
}
