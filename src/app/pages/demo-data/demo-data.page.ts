import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../auth/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {IntegrationService} from '../../@core/service/integration.service';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiService} from "../../@core/service/api.service";
import {Receipt} from "../../@core/common/receipt";
import {combineLatest, empty, Observable, Subject, timer} from "rxjs";
import {catchError, share, switchMap, takeUntil} from "rxjs/operators";
import {IncidentsService} from "../../incidents/services/incidents.service";
import {VerificationService} from "../../verification/services/verification.service";
import {TagRequest} from "../../@core/common/TagRequest";

@Component({
  selector: 'demo-data', styleUrls: ['./demo-data.page.scss'], templateUrl: './demo-data.page.html',
})
export class DemoDataPage implements OnInit, OnDestroy {
  isSpinning = false;
  demoStartTime = "2021-12-01T10:17:43.000"
  demoEndTime = "2021-12-31T09:17:43.000"

  topIncidents$: Observable<any>;
  applicationId = null;
  private stopPolling = new Subject();
  r$: Subject<boolean> = new Subject();
  userId: string;
  isLoadDemo = 0;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private integrationService: IntegrationService, private verificationService: VerificationService, private authService: AuthenticationService, private apiService: ApiService, private notificationService: NotificationsService, private http: HttpClient, private router: Router) {

    this.topIncidents$ = combineLatest([timer(2, 2000), this.r$]).pipe(switchMap(() => this.loadIncidents().pipe(catchError((error) => this.handleError(error)))), share(), takeUntil(this.stopPolling));
  }

  ngOnInit(): void {
    setTimeout(_ => this.r$.next(), 1000); //hack to start first refresh
    this.topIncidents$.subscribe(data => {
      if (data.tagKeys.length > 0 && this.isLoadDemo != 0) {
        if (this.isLoadDemo == 2) {
          this.redirectToVerification()
          this.isLoadDemo = 0
        }
        this.isLoadDemo = 2
      }
    }, () => {
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

  loadIncidents() {
    return this.verificationService.loadAvailableTagKeys(new TagRequest([]));
  }

  redirectToVerification() {
    this.isSpinning = false
    this.router.navigate(['/pages', 'incidents'], {
      queryParams: {
        startTime: this.demoStartTime, endTime: this.demoEndTime, dateTimeType: "absolute", sample: true
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
