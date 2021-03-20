import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '../../@core/common/application';
import { debounceTime, distinctUntilChanged, map, mergeMap, switchMap } from 'rxjs/operators';
import { IntegrationService } from '../../@core/service/integration.service';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { FormControl, FormGroup } from '@angular/forms';
import { VariableAnalysisHit } from '../../@core/common/variable-analysis-hit';
import { HitParam } from '../../@core/common/hit-param';
import { AdDirective } from '../../@core/components/app/ad.directive';

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
  @ViewChild(AdDirective, {static: true}) adHost: AdDirective;
  // variableAnalysisHits: VariableAnalysisHit[] = []
  filterForm = new FormGroup({
    search: new FormControl(),
  });
  constructor(private variableAnalysisService: VariableAnalysisService, private integrationService: IntegrationService,
              private authService: AuthenticationService,
              private notificationService: NotificationsService,
              private componentFactoryResolver: ComponentFactoryResolver) {
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
            // this.variableAnalysisHits = resp
          })
      });

    this.variableAnalysisHits = this.parseVariableAnalysisTemplates(this.variableAnalysisHits)
  }

  applicationSelected(appId: number) {
    this.selectedApplicationId = appId
    this.variableAnalysisService.loadData(this.selectedApplicationId).subscribe(resp => {
      // this.variableAnalysisHits = this.parseVariableAnalysisTemplates(resp)
      console.log('variableAnalysisHits', this.variableAnalysisHits)
    })
  }

  parseVariableAnalysisTemplates(data: VariableAnalysisHit[]) {
    const a = data.map(it => {
      let templates = it.template.split('<*>')
      let parsedTemplates = ''
      for (let i = 0; i < it.params.length; i++) {
        if (templates[i] == '' && i == it.params.length - 1) {
          parsedTemplates += ''
        } else {
          const paramValue = this.getValueForParam(it.params, `param_${i}`)
          parsedTemplates +=
            `${templates[i]}<span class="template" (click)="selectTemplate(${it.template}, param_${i}, ${paramValue})">${paramValue}</span>`
        }
      }
      it.result = parsedTemplates
      return it
    })

    return a;
  }

  selectTemplate(template: string, param: string, value: string) {
    console.log('template', template);
    console.log('param', param);
    console.log('value', value);
  }

  getValueForParam(params: HitParam[], param) {
    return params.find(it => it.key == param).value
  }
}
