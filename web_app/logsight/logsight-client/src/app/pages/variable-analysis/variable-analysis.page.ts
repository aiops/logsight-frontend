import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '../../@core/common/application';
import { debounceTime, distinctUntilChanged, map, mergeMap, switchMap } from 'rxjs/operators';
import { IntegrationService } from '../../@core/service/integration.service';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { FormControl, FormGroup } from '@angular/forms';
import { VariableAnalysisHit } from '../../@core/common/variable-analysis-hit';
import { MessagingService } from '../../@core/service/messaging.service';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';

@Component({
  selector: 'variable-analysis',
  styleUrls: ['./variable-analysis.page.scss'],
  templateUrl: './variable-analysis.page.html',
  encapsulation: ViewEncapsulation.None,
})
export class VariableAnalysisPage implements OnInit {
  applications: Application[] = [];
  selectedApplicationId: number | null;
  variableAnalysisHits: VariableAnalysisHit[] = [{
    result: '',
    message: '',
    template: 'oslo_service.periodic_task <*> - - - - -] Running periodic task <*> run_periodic_tasks <*>',
    params: [{ key: 'param_0', value: 'param0' }, { key: 'param_1', value: 'param1' },
      { key: 'param_2', value: 'param2' }]
  }];
  // variableAnalysisHits: VariableAnalysisHit[] = []
  filterForm = new FormGroup({
    search: new FormControl(),
  });

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
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(search => {
        this.variableAnalysisService.loadData(this.selectedApplicationId, search).subscribe(
          resp => {
            this.variableAnalysisHits = resp
          })
      });

    this.messagingService.getVariableAnalysisTemplate().subscribe(resp => {
      this.variableAnalysisService.loadSpecificTemplate(this.selectedApplicationId, resp['item']).subscribe(resp => {
        this.dialogService.open(SpecificTemplateModalComponent, {
          context: {
            data: resp.second
          }, dialogClass: 'model-full'
        });
      }, err => {
        this.notificationService.error('errror')
      })
    })
  }

  applicationSelected(appId: number) {
    this.selectedApplicationId = appId
    this.variableAnalysisService.loadData(this.selectedApplicationId).subscribe(resp => {
      this.variableAnalysisHits = resp
    })
  }

  selectTemplate(template: string, param: string, value: string) {

  }
}
