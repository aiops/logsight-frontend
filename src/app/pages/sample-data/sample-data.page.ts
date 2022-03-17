import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../auth/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {IntegrationService} from '../../@core/service/integration.service';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {TourService} from "ngx-ui-tour-md-menu";
import {ApiService} from "../../@core/service/api.service";

@Component({
  selector: 'sample-data',
  styleUrls: ['./sample-data.page.scss'],
  templateUrl: './sample-data.page.html',
})
export class SampleDataPage implements OnInit {
  isSpinning = false;

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService, private apiService: ApiService,
              private notificationService: NotificationsService, private http: HttpClient, private router: Router, private tourService: TourService) {
  }

  ngOnInit(): void {
  }

  requestSampleData() {
    this.isSpinning = true
    this.http.post(`/api/v1/demo/hadoop`, {})
      .subscribe(resp => {
        this.isSpinning = false
        this.router.navigate(['/pages', 'dashboard'])
        if (!localStorage.getItem("loadTour")){
          localStorage.setItem("loadTour", "true")
          this.tourService.start()
        }
      }, error => {
        this.isSpinning = false
        this.apiService.handleErrors(error)
      });
  }
}
