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

@Component({
  selector: 'quickstart',
  styleUrls: ['./quickstart.page.scss'],
  templateUrl: './quickstart.page.html',
})
export class QuickstartPage implements OnInit {
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  key: string;
  email: string;
  progressValue: number;
  curSec: number;
  progressIsHidden: boolean;
  applications: Application[] = [];
  next: number;


  public formData = new FormData();
  ReqJson: any = {};

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
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
    });
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

  startTimer(seconds: number) {
    this.progressIsHidden = false
    const time = seconds;
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressValue = Number((sec * 100 / seconds).toPrecision(1));
      this.curSec = sec;
      if (this.curSec === seconds) {
        sub.unsubscribe();
        this.next = this.next + 1;
        // this.router.navigate(['/pages/dashboard'])
      }
    });
  }

  createApplication() {
    if (this.key) {
      // this.integrationService.createApplication({ name: "authN_sample_app", key: this.key }).subscribe(
      //   resp => {
      //     this.notificationService.success('Success', 'Please wait couple of minutes... sample data is streaming into logsight.ai.')
      //   }, error => this.notificationService.error('Error', 'Sorry, a problem happened'))

      this.startTimer(10)
    } else {
      this.notificationService.error('Error', 'Sorry, a problem happened')
    }
  }

  startTutorial(){
    this.tourService.start()
  }

}
