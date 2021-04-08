import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '../../@core/common/application';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { IntegrationService } from '../../@core/service/integration.service';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { FormControl, FormGroup } from '@angular/forms';
import { VariableAnalysisHit } from '../../@core/common/variable-analysis-hit';
import { MessagingService } from '../../@core/service/messaging.service';
import { NbDialogService } from '@nebular/theme';
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
  // variableAnalysisHits: VariableAnalysisHit[] = [{
  //   result: '',
  //   message: '',
  //   template: 'oslo_service.periodic_task <*> - - - - -] Running periodic task <*> run_periodic_tasks <*>',
  //   params: [{ key: 'param_0', value: 'param0' }, { key: 'param_1', value: 'param1' },
  //     { key: 'param_2', value: 'param2' }]
  // }];
  variableAnalysisHits: VariableAnalysisHit[] = []
  logCountLineChart = []
  filterForm = new FormGroup({
    search: new FormControl(),
  });
  topNTemplatesNow: TopNTemplatesData[];
  topNTemplatesOlder: TopNTemplatesData[];

  constructor(private variableAnalysisService: VariableAnalysisService, private integrationService: IntegrationService,
              private authService: AuthenticationService,
              private notificationService: NotificationsService,
              private messagingService: MessagingService,
              private dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().pipe(
      switchMap(user => this.integrationService.loadApplications(user.key))
    ).subscribe(resp => this.applications = resp)

    this.filterForm.get('search').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(search => {
        this.variableAnalysisService.loadData(this.selectedApplicationId, search).subscribe(
          resp => {
            this.variableAnalysisHits = resp
          })
      });

    this.messagingService.getVariableAnalysisTemplate().subscribe(selected => {
      if (this.selectedApplicationId) {
        this.variableAnalysisService.loadSpecificTemplate(this.selectedApplicationId, selected['item']).subscribe(
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

  applicationSelected(appId: number) {
    this.selectedApplicationId = appId
    this.variableAnalysisService.loadData(this.selectedApplicationId).subscribe(resp => {
      this.variableAnalysisHits = resp
    });

    this.variableAnalysisService.getLogCountLineChart(this.selectedApplicationId).subscribe(resp => {
      this.logCountLineChart = resp
    });

    this.variableAnalysisService.getTopNTemplates(this.selectedApplicationId).subscribe(resp => {
      this.topNTemplatesNow = resp.now;
      this.topNTemplatesOlder = resp.older;
    });
  }
}
