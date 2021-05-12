import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbDialogService, NbThemeService } from '@nebular/theme';
import { DashboardService } from './dashboard.service';
import { TopKIncident } from '../../@core/common/top-k-Incident';
import { Router } from '@angular/router';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { MessagingService } from '../../@core/service/messaging.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthenticationService } from '../../auth/authentication.service';
import { retry, share, switchMap, takeUntil } from 'rxjs/operators';
import { Application } from '../../@core/common/application';
import { IntegrationService } from '../../@core/service/integration.service';
import { Observable, Subject, timer } from 'rxjs';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit, OnDestroy {
  heatmapData = [];
  pieChartData = [];
  stackedChartData = [];
  barData = [];
  topKIncidents: TopKIncident[] = [];
  applications: Application[] = [];
  private stopPolling = new Subject();

  heatmapData$: Observable<any>;
  pieChartData$: Observable<any>;
  stackedAreaChartData$: Observable<any>;
  topKIncidents$: Observable<any>;
  barData$: Observable<any>;

  constructor(private dashboardService: DashboardService, private router: Router,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService,
              private authService: AuthenticationService,
              private integrationService: IntegrationService) {

    this.heatmapData$ = timer(1, 10000).pipe(
      switchMap(() => this.loadHeatmapData()),
      retry(),
      share(),
      takeUntil(this.stopPolling)
    );

    this.pieChartData$ = timer(1, 10000).pipe(
      switchMap(() => this.loadPieChartData()),
      retry(),
      share(),
      takeUntil(this.stopPolling)
    );

    this.stackedAreaChartData$ = timer(1, 10000).pipe(
      switchMap(() => this.loadStackedAreaChartData()),
      retry(),
      share(),
      takeUntil(this.stopPolling)
    );

    this.topKIncidents$ = timer(1, 10000).pipe(
      switchMap(() => this.loadTopKIncidents()),
      retry(),
      share(),
      takeUntil(this.stopPolling)
    );

    this.barData$ = timer(1, 10000).pipe(
      switchMap(() => this.loadBarData()),
      retry(),
      share(),
      takeUntil(this.stopPolling)
    );


  }

  ngOnInit(): void {
    this.heatmapData$.subscribe(data => {
      this.heatmapData = data.data;
    })

    this.pieChartData$.subscribe(data => {
      this.pieChartData = data.data;
    })

    this.stackedAreaChartData$.subscribe(data => {
      this.stackedChartData = data.data;
    })

    this.topKIncidents$.subscribe(data => {
      this.topKIncidents = data.map(it => {
        const scAnomalies = this.parseTemplates(it, 'scAnomalies').sort((a, b) => b.timeStamp - a.timeStamp)
        const newTemplates = this.parseTemplates(it, 'newTemplates').sort((a, b) => b.timeStamp - a.timeStamp)
        const semanticAD = this.parseTemplates(it, 'semanticAD').sort((a, b) => b.timeStamp - a.timeStamp)
        const countAD = this.parseTemplates(it, 'countAD').sort((a, b) => b.timeStamp - a.timeStamp)
        return { timestamp: it.timestamp, startTimestamp: it.startTimestamp, stopTimestamp: it.stopTimestamp, scAnomalies, newTemplates, semanticAD, countAD }
      });
    })

    this.barData$.subscribe(data => {
      this.barData = data;
      console.log('barData', this.barData)
    })

    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => this.applications = resp)

    this.messagingService.getVariableAnalysisTemplate().subscribe(selected => {
      if (true) {
        this.variableAnalysisService.loadSpecificTemplate(this.applications[0].id, selected['item']).subscribe(
          resp => {
            this.dialogService.open(SpecificTemplateModalComponent, {
              context: {
                data: resp.second,
                type: resp.first
              }, dialogClass: 'model-full'
            });
          }, err => {
            console.log(err)
            this.notificationService.error('Error', 'Error fetching data')
          })
      }
    })
  }

  loadHeatmapData() {
    return this.dashboardService.loadHeatmapData()
  }

  loadBarData() {
    return this.dashboardService.loadBarData();
  }

  loadPieChartData() {
    return this.dashboardService.loadPieChartData();
  }

  loadStackedAreaChartData() {
    return this.dashboardService.loadStackedChartData();
  }

  loadTopKIncidents() {
    return this.dashboardService.loadTopKIncidentsData();
  }

  onHeatMapSelect(data: any) {
    const dateTime = data.series
    console.log("TIME", dateTime)
    const date = dateTime.split(' ')[0].split('-');
    const time = dateTime.split(' ')[1].split(':');
    const startDateTime: Moment = moment().year(+date[2]).month(+date[1] - 1).date(+date[0]).hour(+time[0]).minute(
      +time[1]);
    this.navigateToIncidentsPage(startDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'), null)
  }

  parseTemplates(data, incident) {
    return JSON.parse(data[incident]).map(it2 => {
      let params = [];
      Object.keys(it2[0]).forEach(key => {
        if (key.startsWith('param_')) {
          params.push({ key, value: it2[0][key] })
        }
      });
      return {
        message: it2[0].message,
        template: it2[0].template,
        params: params,
        actualLevel: it2[0].actual_level,
        timeStamp: new Date(it2[0]['@timestamp'])
      }
    });
  }

  viewDetails(startTime: string, endTime: string) {
    console.log("III", startTime, endTime)
    this.navigateToIncidentsPage(startTime, endTime)
  }



  ngOnDestroy() {
    this.stopPolling.next();
  }

  private navigateToIncidentsPage(startTime: string, endTime: String, applicationId: number = 1) {
    this.router.navigate(['/pages', 'incidents'], { queryParams: { startTime, endTime, applicationId } })
  }
}
