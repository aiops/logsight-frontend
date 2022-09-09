import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Application } from '../common/application';
import {LogFileType} from "../common/log-file-type";
import {ApplicationList} from "../common/applicationList";

@Injectable()
export class IntegrationService {
  constructor(private apiService: ApiService) {
  }

  subscription(payment: any) {
    return this.apiService.post(`/api/v1/payments`, payment)
  }

  checkCustomerPortal() {
    return this.apiService.post(`/api/v1/payments/customer_portal`, { 'body': 'empty' })
  }

}
