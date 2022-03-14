import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IntegrationService} from "../../@core/service/integration.service";
import {AuthenticationService} from "../../auth/authentication.service";
import {NotificationsService} from "angular2-notifications";
import {Application} from "../../@core/common/application";
import {Router} from "@angular/router";
import {interval} from "rxjs";
import {TourService} from "ngx-ui-tour-md-menu";
import {FileUploadValidators} from "@iplab/ngx-file-upload";
import {HttpClient, HttpRequest} from "@angular/common/http";
import {LogsightUser} from "../../@core/common/logsight-user";

@Component({
  selector: 'send-logs',
  styleUrls: ['./quickstart.page.scss'],
  templateUrl: './quickstart.page.html',
})
export class QuickstartPage implements OnInit {
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  user: LogsightUser
  progressValue: number;
  curSec: number;
  progressIsHidden: boolean;
  applications: Application[] = [];
  next: number;


  public formData = new FormData();

  constructor(private fb: FormBuilder,
              private integrationService: IntegrationService,
              private authService: AuthenticationService,
              private notificationService: NotificationsService,
              private router: Router,
              private tourService: TourService) {

  }


  ngOnInit() {
    this.progressIsHidden = true
    this.progressValue = 0
    this.curSec = 0
    this.next = 0
    this.authService.getLoggedUser(localStorage.getItem('userId')).subscribe(user => {
      this.user = user
    });
  }

  redirectToUploadLogFile(){
    this.router.navigate(['pages','file-upload'])
  }

  redirectToSampleData(){
    this.router.navigate(['pages','sample-data'])
  }

  redirectToElasticsearch(){
    this.router.navigate(['pages','elasticsearch-data'])
  }

  redirectToSwagger(){
    window.open(
  'https://docs.logsight.ai/#/detect_incidents/using_the_rest_api?id=send-logs',
  '_blank' // <- This is what makes it open in a new window.
    );
  }



  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  onCardClick(){
    this.router.navigate(['/pages/integration'])
  }



}
