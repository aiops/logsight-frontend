import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService, NbPopoverDirective, NbThemeService } from '@nebular/theme';
import { DashboardService } from './dashboard.service';
import { TopKIncident } from '../../@core/common/top-k-Incident';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { MessagingService } from '../../@core/service/messaging.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthenticationService } from '../../auth/authentication.service';
import { map, retry, share, skip, switchMap, takeUntil, timeout } from 'rxjs/operators';
import { Application } from '../../@core/common/application';
import { IntegrationService } from '../../@core/service/integration.service';
import { Observable, Subject, timer, combineLatest } from 'rxjs';
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
  openDatePicker = false;
  heatmapData$: Observable<any>;
  pieChartData$: Observable<any>;
  stackedAreaChartData$: Observable<any>;
  topKIncidents$: Observable<any>;
  barData$: Observable<any>;
  startDateTime = 'now-12h';
  endDateTime = 'now'
  reload$: Subject<boolean> = new Subject();
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dashboardService: DashboardService, private router: Router, private route: ActivatedRoute,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService,
              private authService: AuthenticationService,
              private integrationService: IntegrationService) {
    this.heatmapData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadHeatmapData(this.startDateTime, this.endDateTime)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.pieChartData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadPieChartData(this.startDateTime, this.endDateTime)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.stackedAreaChartData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadStackedAreaChartData(this.startDateTime, this.endDateTime)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.topKIncidents$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadTopKIncidents(this.startDateTime, this.endDateTime)),
      share(),
      takeUntil(this.stopPolling)
    );

    this.barData$ = combineLatest([timer(1, 10000), this.reload$]).pipe(
      switchMap(() => this.loadBarData(this.startDateTime, this.endDateTime)),
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
        return {
          applicationId: it.applicationId,
          appName: it.indexName,
          timestamp: it.timestamp,
          startTimestamp: it.startTimestamp,
          stopTimestamp: it.stopTimestamp,
          scAnomalies,
          newTemplates,
          semanticAD,
          countAD
        }
      });
    })

    this.barData$.subscribe(data => {
      this.barData = data;
    })

    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => this.applications = resp)

    this.messagingService.getVariableAnalysisTemplate()
      .pipe(takeUntil(this.destroy$), map(it => it['item']))
      .subscribe(selected => {
        this.variableAnalysisService.loadSpecificTemplate(selected.applicationId, this.startDateTime,
          this.endDateTime, selected)
          .subscribe(
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
      })
    setTimeout(_ => this.reload$.next(), 2000); //hack to start first refresh

    this.route.queryParamMap.subscribe(queryParams => {
      const startTime = queryParams.get('startTime');
      const endTime = queryParams.get('endTime');
      const dateTimeType = queryParams.get('dateTimeType');
      if (startTime && endTime) {
        if (dateTimeType == 'absolute') {
          this.startDateTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
          this.endDateTime = moment(endTime, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
        } else {
          this.startDateTime = startTime;
          this.endDateTime = endTime;
        }
        this.reload$.next()
      } else {
        this.startDateTime = 'now-12h'
        this.endDateTime = 'now'
        this.reload$.next()
      }
    })
  }

  loadHeatmapData(startTime: string, endTime: string) {
    return this.dashboardService.loadHeatmapData(startTime, endTime, null)
  }

  loadBarData(startTime: string, endTime: string) {
    return this.dashboardService.loadBarData(startTime, endTime);
  }

  loadPieChartData(startTime: string, endTime: string) {
    return this.dashboardService.loadPieChartData(startTime, endTime);
  }

  loadStackedAreaChartData(startTime: string, endTime: string) {
    return this.dashboardService.loadStackedChartData(startTime, endTime);
  }

  loadTopKIncidents(startTime: string, endTime: string) {
    return this.dashboardService.loadTopKIncidentsData(startTime, endTime);
  }

  onHeatMapSelect(data: any) {
    const dateTime = data.series
    const date = dateTime.split(' ')[0].split('-');
    const time = dateTime.split(' ')[1].split(':');
    const startDateTime: Moment = moment().year(+date[2]).month(+date[1] - 1).date(+date[0]).hour(+time[0]).minute(
      +time[1]);
    this.navigateToIncidentsPage(startDateTime.format('YYYY-MM-DDTHH:mm:ss.sss'),
      startDateTime.add(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sss'), data.id)
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
        timeStamp: new Date(it2[0]['@timestamp']),
        applicationId: data.applicationId //this should be checked
      }
    });
  }

  viewDetails(startTime: string, endTime: string, applicationId: number) {
    this.navigateToIncidentsPage(startTime, endTime, applicationId)
  }

  ngOnDestroy() {
    this.stopPolling.next();
    this.destroy$.next()
    this.destroy$.complete()
  }

  private navigateToIncidentsPage(startTime: string, endTime: String, applicationId: number) {
    this.router.navigate(['/pages', 'incidents'], { queryParams: { startTime, endTime, applicationId } })
  }

  onDateTimeSearch(event) {
    this.popover.hide();
    this.openDatePicker = false;
    let dateTimeType = 'absolute';
    if (event.relativeTimeChecked) {
      this.startDateTime = event.relativeDateTime
      this.endDateTime = 'now'
      dateTimeType = 'relative';
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = event.absoluteDateTime.startDateTime.toISOString()
      this.endDateTime = event.absoluteDateTime.endDateTime.toISOString()
    }
    this.router.navigate([],
      { queryParams: { startTime: this.startDateTime, endTime: this.endDateTime, dateTimeType } })
    this.reload$.next();
  }

  openPopover() {
    this.popover.show();
    this.openDatePicker = !this.openDatePicker
    if (!this.openDatePicker) {
      this.popover.hide();
    }
  }
}
