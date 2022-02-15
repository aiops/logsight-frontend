import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../auth/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {Application} from '../../@core/common/application';
import {IntegrationService} from '../../@core/service/integration.service';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {TourService} from "ngx-ui-tour-md-menu";
import {ApiService} from "../../@core/service/api.service";

@Component({
  selector: 'elasticsearch-data',
  styleUrls: ['./elasticsearch-data.page.scss'],
  templateUrl: './elasticsearch-data.page.html',
})
export class ElasticsearchDataPage implements OnInit {
  applicationId: string;
  isSpinning = false;
  applications: Application[] = [];
  applicationName: String;
  isElasticConnection = false;
  public uploadFile: boolean = true;

  currentElasticsearch = ""
  formElasticsearch = new FormGroup({
    elasticsearchUrl: new FormControl(''),
    elasticsearchIndex: new FormControl(''),
    elasticsearchPeriod: new FormControl('', Validators.min(1)),
    elasticsearchUser: new FormControl(''),
    elasticsearchPassword: new FormControl('')
  });

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService, private apiService: ApiService,
              private notificationService: NotificationsService, private http: HttpClient, private router: Router, private tourService: TourService) {
  }

  ngOnInit(): void {
  }


  applicationSelected(appId: string) {
    this.applications.forEach(it => {
      if (appId == it.applicationId) {
        this.applicationName = it.name
      }
    })
    appId === null ? this.applicationId = null : this.applicationId = appId;
  }


  checkElasticsearchConnection() {
    this.http.post(`/api/logs/test_elasticsearch`, this.formElasticsearch.value)
      .subscribe(resp => {
        this.isElasticConnection = true
        this.notificationService.success("Success", resp['detail'], this.apiService.getNotificationOpetions())
      }, error => {
        this.apiService.handleErrors(error)
      });
  }


  requestElasticsearchData() {
    this.http.post(`/api/logs/load_elasticsearch`, this.formElasticsearch.value)
      .subscribe(resp => {
        this.notificationService.success("Connected", "Successfully connected to elasticsearch. Ingesting logs...", this.apiService.getNotificationOpetions())
        this.router.navigate(['/pages', 'log-compare'])
      }, error => {
        this.apiService.handleErrors(error)
      });
  }


  loadApplications(userId: string) {
    this.integrationService.loadApplications(userId).subscribe(resp => this.applications = resp.applications)
  }


}
