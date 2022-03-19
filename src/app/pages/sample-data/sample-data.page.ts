import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../auth/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {IntegrationService} from '../../@core/service/integration.service';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {TourService} from "ngx-ui-tour-md-menu";
import {ApiService} from "../../@core/service/api.service";
import {Receipt} from "../../@core/common/receipt";
import {defer, Observable} from "rxjs";
import {delay, expand, filter, repeatWhen, retry, take, takeWhile, timeout, toArray} from "rxjs/operators";
import {Flush} from "../../@core/common/flush";

@Component({
  selector: 'demo-data',
  styleUrls: ['./sample-data.page.scss'],
  templateUrl: './sample-data.page.html',
})
export class SampleDataPage implements OnInit {
  isSpinning = false;
  listResults = []

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService, private apiService: ApiService,
              private notificationService: NotificationsService, private http: HttpClient, private router: Router, private tourService: TourService) {
  }

  ngOnInit(): void {
  }


  redirectToDashboard(result, size) {
    this.listResults.push(result)
    if (this.listResults.length == size) {
      this.isSpinning = false
      this.router.navigate(['/pages', 'dashboard'])
      if (!localStorage.getItem("loadTour")) {
        localStorage.setItem("loadTour", "true")
        this.tourService.start()

      }
    }
  }

  requestSampleData() {
    this.isSpinning = true
    this.http.post<Receipt[]>(`/api/v1/demo/hadoop`, {})
      .subscribe(receipts => {
        for (let i = 0; i < receipts.length; i++) {
          this.http.post<Flush>(`/api/v1/logs/flush`, {"receiptId": receipts[i].receiptId}).subscribe(flush => {
            this.http.get<Flush>(`/api/v1/logs/flush/${flush.flushId}`).pipe(
              repeatWhen(obs => obs),
              filter(data => data.status == "DONE"),
              take(1)
            ).subscribe(result => this.redirectToDashboard(result, receipts.length));
          })
        }


      }, error => {
        this.isSpinning = false
        this.apiService.handleErrors(error)
      });
  }
}
