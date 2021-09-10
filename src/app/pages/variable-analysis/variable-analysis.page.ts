import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '../../@core/common/application';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { IntegrationService } from '../../@core/service/integration.service';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { FormControl, FormGroup } from '@angular/forms';
import { VariableAnalysisHit } from '../../@core/common/variable-analysis-hit';
import { MessagingService } from '../../@core/service/messaging.service';
import { NbDialogService, NbPopoverDirective } from '@nebular/theme';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { TopNTemplatesData } from '../../@core/common/top-n-templates-data';
import { TopNTemplatesDataMerged } from '../../@core/common/top-n-templates-data-merged';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { PredefinedTime } from '../../@core/common/predefined-time';
import { DashboardService } from '../dashboard/dashboard.service';
import {rgb} from "d3";

@Component({
  selector: 'variable-analysis',
  styleUrls: ['./variable-analysis.page.scss'],
  templateUrl: './variable-analysis.page.html',
  encapsulation: ViewEncapsulation.None,
})

export class VariableAnalysisPage implements OnInit {
  applications: Application[] = [];
  selectedApplicationId: number | null;
  variableAnalysisHits: VariableAnalysisHit[] = []
  logCountLineChart = []
  filterForm = new FormGroup({
    search: new FormControl(),
  });
  topNTemplatesNow: TopNTemplatesData[];
  topNTemplatesOlder: TopNTemplatesData[];
  templatesRowMerged: TopNTemplatesDataMerged[];
  allTemplatesLoading: boolean;
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  openDatePicker = false;
  startDateTime = 'now-720m';
  endDateTime = 'now'
  private destroy$: Subject<void> = new Subject<void>();
  predefinedTimes: PredefinedTime[] = [];
      colorScheme = {
    domain: ['#00ff00']
  };
  constructor(private variableAnalysisService: VariableAnalysisService,
              private integrationService: IntegrationService,
              private authService: AuthenticationService,
              private notificationService: NotificationsService,
              private messagingService: MessagingService,
              private dialogService: NbDialogService,
              private router: Router,
              private route: ActivatedRoute,
              private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => {
      this.applications = resp;
      if (this.applications.length > 0) {
        this.selectedApplicationId = this.applications[0].id;
        this.subscribeQueryParams();
      }
    })

    this.filterForm.get('search').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(search => {
        this.allTemplatesLoading = true
        this.loadVariableAnalysisData(search);
      });

    this.messagingService.getVariableAnalysisTemplate().pipe(takeUntil(this.destroy$)).subscribe(selected => {
      if (this.selectedApplicationId) {
        this.variableAnalysisService.loadSpecificTemplate(this.selectedApplicationId, this.startDateTime,
          this.endDateTime, selected['item']).subscribe(
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

    this.loadPredefinedTimes();
  }

  subscribeQueryParams() {
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
      } else {
        this.startDateTime = 'now-720m'
        this.endDateTime = 'now'
      }
      this.applicationSelected(this.selectedApplicationId);
    })
  }

  loadVariableAnalysisData(search: string | null = null) {
    this.variableAnalysisService.loadData(this.selectedApplicationId, this.startDateTime, this.endDateTime,
      search).subscribe(
      resp => {
        for (let i = 0; i < resp.length; i++) {
          var date = moment.utc(resp[i].timestamp, 'DD-MM-YYYY HH:mm:ss.SSS').format('DD-MM-YYYY HH:mm:ss.SSS');
          var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm:ss.SSS');
          var local = moment(stillUtc, 'DD-MM-YYYY HH:mm:ss.SSS').local().format('DD-MM-YYYY HH:mm:ss.SSS');
          resp[i].timestamp = local.toString()
        }

        this.variableAnalysisHits = resp;
        this.allTemplatesLoading = false;
      }, error => {
        this.allTemplatesLoading = false;
        this.notificationService.error('Error', 'Error loading templates')
      })
  }

  applicationSelected(appId: number) {
    this.selectedApplicationId = appId
    this.loadVariableAnalysisData();

    this.variableAnalysisService.getLogCountLineChart(this.selectedApplicationId, this.startDateTime,
      this.endDateTime).subscribe(resp => {
      for (let i = 0; i < resp[0].series.length; i++) {
        var date = moment.utc(resp[0].series[i].name, 'DD-MM-YYYY HH:mm:ss.SSS').format('DD-MM-YYYY HH:mm:ss.SSS');
        var stillUtc = moment.utc(date, 'DD-MM-YYYY HH:mm:ss.SSS');
        var local = moment(stillUtc, 'DD-MM-YYYY HH:mm:ss.SSS').local().format('MMM DD HH:mm');
        resp[0].series[i].name = local.toString()
      }
      this.logCountLineChart = resp
    });

    this.variableAnalysisService.getTopNTemplates(this.selectedApplicationId, this.startDateTime,
      this.endDateTime).subscribe(resp => {
      this.topNTemplatesNow = resp.now;
      this.topNTemplatesOlder = resp.older;
      this.templatesRowMerged = [];
      for (var _i = 0; _i < this.topNTemplatesNow.length; _i++) {
        if(this.topNTemplatesOlder[_i]){
            this.templatesRowMerged.push({
                new: this.topNTemplatesNow[_i],
                old: this.topNTemplatesOlder[_i]
        });
        }else{
          let tmp = this.topNTemplatesNow[_i]
          tmp.count = 0
          tmp.percentage = 0
          this.templatesRowMerged.push({
                new: this.topNTemplatesNow[_i],
                old: tmp
        });

        }

      }
    });
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
      this.startDateTime = event.absoluteDateTime.startDateTime;
      this.endDateTime = event.absoluteDateTime.endDateTime;
    }
    this.applicationSelected(this.selectedApplicationId)
    this.router.navigate([],
      { queryParams: { startTime: this.startDateTime, endTime: this.endDateTime, dateTimeType } })
  }

  openPopover() {
    this.popover.show();
    this.openDatePicker = !this.openDatePicker
    if (!this.openDatePicker) {
      this.popover.hide();
    }
  }

  loadPredefinedTimes() {
    this.dashboardService.findPredefinedTimes().subscribe(resp => this.predefinedTimes = resp)
  }

  onDeletePredefinedTime(id: number) {
    this.dashboardService.deletePredefinedTime(id).subscribe(() => this.loadPredefinedTimes())
  }

  onSavePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.createPredefinedTime(predefinedTime).subscribe(resp => this.loadPredefinedTimes())
  }

  onSelectPredefinedTime(pt: PredefinedTime) {
    if (pt.dateTimeType == 'RELATIVE') {
      this.onDateTimeSearch({ relativeTimeChecked: true, relativeDateTime: pt.endTime })
    } else {
      this.onDateTimeSearch({
        absoluteTimeChecked: true, absoluteDateTime: {
          startDateTime: pt.startTime,
          endDateTime: pt.endTime
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
