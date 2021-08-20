import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import {Observable} from "rxjs";

@Injectable()
export class LogCompareService {
  constructor(private apiService: ApiService) {
  }

}
