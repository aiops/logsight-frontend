import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '../../@core/common/application';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IntegrationService } from '../../@core/service/integration.service';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { FormControl, FormGroup } from '@angular/forms';
import { VariableAnalysisHit } from '../../@core/common/variable-analysis-hit';
import { MessagingService } from '../../@core/service/messaging.service';
import { NbDialogService, NbPopoverDirective } from '@nebular/theme';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { TopNTemplatesData } from '../../@core/common/top-n-templates-data';

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
  allTemplatesLoading: boolean;
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  openDatePicker = false;
  startDateTime = 'now-12h';
  endDateTime = 'now'

  constructor(private variableAnalysisService: VariableAnalysisService,
              private integrationService: IntegrationService,
              private authService: AuthenticationService,
              private notificationService: NotificationsService,
              private messagingService: MessagingService,
              private dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => {
      this.applications = resp;
      if (this.applications.length > 0) {
        this.selectedApplicationId = this.applications[0].id;
        this.applicationSelected(this.selectedApplicationId);
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

    this.messagingService.getVariableAnalysisTemplate().subscribe(selected => {
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
  }

  loadVariableAnalysisData(search: string | null = null) {
    this.variableAnalysisService.loadData(this.selectedApplicationId, this.startDateTime, this.endDateTime,
      search).subscribe(
      resp => {
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
      this.logCountLineChart = resp
    });

    this.variableAnalysisService.getTopNTemplates(this.selectedApplicationId, this.startDateTime,
      this.endDateTime).subscribe(resp => {
      this.topNTemplatesNow = resp.now;
      this.topNTemplatesOlder = resp.older;
    });
  }

  onDateTimeSearch(event) {
    this.popover.hide();
    this.openDatePicker = false;
    if (event.relativeTimeChecked) {
      this.startDateTime = event.relativeDateTime
      this.endDateTime = 'now'
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = event.absoluteDateTime.startDateTime.toISOString()
      this.endDateTime = event.absoluteDateTime.endDateTime.toISOString()
    }
    this.applicationSelected(this.selectedApplicationId)
  }

  openPopover() {
    this.popover.show();
    this.openDatePicker = !this.openDatePicker
    if (!this.openDatePicker) {
      this.popover.hide();
    }
  }
}
