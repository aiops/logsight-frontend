import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../auth/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {IntegrationService} from '../../@core/service/integration.service';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {TourService} from "ngx-ui-tour-md-menu";
import {ApiService} from "../../@core/service/api.service";
import {Receipt} from "../../@core/common/receipt";
import {combineLatest, empty, Observable, Subject, timer} from "rxjs";
import {catchError, share, switchMap, takeUntil} from "rxjs/operators";
import {IncidentTableData} from "../../@core/common/incident-table-data";
import {ChartRequest} from "../../@core/common/chart-request";
import {ChartConfig} from "../../@core/common/chart-config";
import {DashboardService} from "../dashboard/dashboard.service";

@Component({
  selector: 'demo-data',
  styleUrls: ['./demo-data.page.scss'],
  templateUrl: './demo-data.page.html',
})
export class DemoDataPage implements OnInit, OnDestroy {
  isSpinning = false;
  demoStartTime = "2021-12-01T10:17:43.000Z"
  demoEndTime = "2021-12-31T09:17:43.000Z"

  topIncidents$: Observable<any>;
  applicationId = null;
  private stopPolling = new Subject();
  r$: Subject<boolean> = new Subject();
  userId: string;
  isLoadDemo=0;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private integrationService: IntegrationService, private dashboardService: DashboardService, private authService: AuthenticationService, private apiService: ApiService,
              private notificationService: NotificationsService, private http: HttpClient, private router: Router, private tourService: TourService) {

    this.topIncidents$ = combineLatest([timer(2, 5000), this.r$]).pipe(
      switchMap(() => this.loadTopKIncidents(this.demoStartTime, this.demoEndTime, 5, this.applicationId).pipe(catchError((error) => this.handleError(error)))),
      share(),
      takeUntil(this.stopPolling)
        );
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    setTimeout(_ => this.r$.next(), 1000); //hack to start first refresh
    this.topIncidents$.subscribe(data => {
      data = data.data.data
      if (data.length > 0) {
        if (this.isLoadDemo == 2){
          this.redirectToDashboard()
          this.isLoadDemo = 0
        }
        this.isLoadDemo = 2
      }
    }, error => {
    })
  }
    ngOnDestroy() {
    this.stopPolling.next();
    this.destroy$.next()
    this.destroy$.complete()
  }


  private handleError(error: HttpErrorResponse) {
    return empty();
  }

  loadTopKIncidents(startTime: string, endTime: string, numberOfIncidents: number, applicationId: string) {
    let parameters = {"type":"tablechart", "feature": "system_overview", "indexType":"incidents", "startTime": startTime, "stopTime": endTime, "numElements": numberOfIncidents}
    let chartRequest = new ChartRequest(new ChartConfig(parameters), applicationId)
    return this.dashboardService.loadTopKIncidentsData(this.userId, chartRequest);
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
    this.isLoadDemo = 1
    this.http.post<Receipt[]>(`/api/v1/demo/hadoop`, {})
      .subscribe(receipts => {
      }, error => {
        this.isSpinning = false
        this.apiService.handleErrors(error.error)
      });
  }
}
