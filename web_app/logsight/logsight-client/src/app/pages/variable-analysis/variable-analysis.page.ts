import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '../../@core/common/application';
import { debounceTime, distinctUntilChanged, map, mergeMap, switchMap } from 'rxjs/operators';
import { IntegrationService } from '../../@core/service/integration.service';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'variable-analysis',
  styleUrls: ['./variable-analysis.page.scss'],
  templateUrl: './variable-analysis.page.html',
})
export class VariableAnalysisPage implements OnInit {
  applications: Application[] = [];
  selectedApplicationId: number | null;
  variableAnalysis = [];
  filterForm = new FormGroup({
    search: new FormControl(),
  });

  constructor(private variableAnalysisService: VariableAnalysisService, private integrationService: IntegrationService,
              private authService: AuthenticationService,
              private notificationService: NotificationsService) {
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
        this.variableAnalysisService.loadData(this.selectedApplicationId, search).subscribe()
      });
  }

  applicationSelected(appId: number) {
    this.selectedApplicationId = appId
    this.variableAnalysisService.loadData(this.selectedApplicationId).subscribe()
  }

}
