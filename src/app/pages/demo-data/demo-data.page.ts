import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../auth/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {IntegrationService} from '../../@core/service/integration.service';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {TourService} from "ngx-ui-tour-md-menu";
import {ApiService} from "../../@core/service/api.service";
import {Receipt} from "../../@core/common/receipt";

@Component({
  selector: 'demo-data',
  styleUrls: ['./demo-data.page.scss'],
  templateUrl: './demo-data.page.html',
})
export class DemoDataPage implements OnInit {
  isSpinning = false;
  demoStartTime = "2021-12-01T10:17:43.000Z"
  demoEndTime = "2021-12-31T09:17:43.000Z"

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService, private apiService: ApiService,
              private notificationService: NotificationsService, private http: HttpClient, private router: Router, private tourService: TourService) {
  }

  ngOnInit(): void {
  }

  redirectToDashboard() {
    this.isSpinning = false
    this.router.navigate(['/pages', 'dashboard'], {
      queryParams: {
        startTime: this.demoStartTime,
        endTime: this.demoEndTime,
        dateTimeType: "absolute",
        sample: true
      }
    })
  }

  requestSampleData() {
    this.isSpinning = true
    this.http.post<Receipt[]>(`/api/v1/demo/hadoop`, {})
      .subscribe(receipts => {
        setTimeout(_ => this.redirectToDashboard(), 25 * 1000)
      }, error => {
        this.isSpinning = false
        this.apiService.handleErrors(error.error)
      });
  }
}
