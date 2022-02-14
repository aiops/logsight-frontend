import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../auth/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {Application} from '../../@core/common/application';
import {IntegrationService} from '../../@core/service/integration.service';
import {HighlightResult} from 'ngx-highlightjs';
import {loadStripe} from '@stripe/stripe-js/pure';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {LogFileType} from "../../@core/common/log-file-type";
import {interval, Observable, Subject, Subscription} from "rxjs";
import {TourService} from "ngx-ui-tour-md-menu";
import {PredefinedTime} from "../../@core/common/predefined-time";
import {TopKIncident} from "../../@core/common/top-k-Incident";
import {NbPopoverDirective} from "@nebular/theme";
import {DashboardService} from "../dashboard/dashboard.service";

@Component({
  selector: 'elasticsearch-data',
  styleUrls: ['./elasticsearch-data.page.scss'],
  templateUrl: './elasticsearch-data.page.html',
})
export class ElasticsearchDataPage implements OnInit {
  key: string;
  email: string;
  quantity: number;
  hasPaid: Boolean;
  applicationId: number;
  isSpinning = false;
  logFileType: String;
  applications: Application[] = [];
  logFileTypes: LogFileType[] = [];
  applicationName: String;
  isElasticConnection = false;
  public show: boolean = false;
  public uploadFile: boolean = true;
  public showHideAppBtn: any = 'Show';
  public pythonBtn: any = 'Python SDK';
  public dockerBtn: any = 'Docker';
  public loadDemoAppBtn: any = 'Load sample';
  public uploadBtn: any = 'Upload log file';
  public restBtn: any = 'REST API';


  // sss

  selectedTime = "";
  colorSubscription: Subscription;
  pieChartData = [];
  stackedChartData = [];
  barDatabarData = [];
  barData = []
  topKIncidents: TopKIncident[] = [];
  private stopPolling = new Subject();
  openDatePicker = false;
  startDateTime = 'now-5m';
  endDateTime = 'now'
  heatmapHeight = '200px';
  numberOfIncidents = 5;
  heatmapHeightList = [];
  unique = [];
  colorPieData = {}
  user: any;
  clientTimezoneOffset = new Date().getTimezoneOffset()/60;//offset in hours
  reload$: Subject<boolean> = new Subject();
  @ViewChild('dateTimePicker', { read: TemplateRef }) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  private destroy$: Subject<void> = new Subject<void>();
  predefinedTimes: PredefinedTime[] = [];

  // sss






  progressValue: number;
  curSec: number;

  currentElasticsearch = ""

  format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+/;
  formElasticsearch = new FormGroup({
      elasticsearchUrl: new FormControl(''),
      elasticsearchIndex: new FormControl(''),
      elasticsearchPeriod: new FormControl('', Validators.min(1)),
      elasticsearchTimestamp: new FormControl(''),
      elasticsearchStartTime: new FormControl(''),
      elasticsearchEndTime: new FormControl(''),
      elasticsearchUser: new FormControl(''),
      elasticsearchPassword: new FormControl('')
  });


  public formData = new FormData();
  ReqJson: any = {};

  response: HighlightResult;
  customerId = ''
  code_python = ''
  code_docker = ''
  code_rest = ''
  code_upload = ''

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService, private dashboardService: DashboardService,
              private notificationService: NotificationsService, private http: HttpClient, private router: Router, private tourService: TourService) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
      this.hasPaid = user.hasPaid
      this.currentElasticsearch = user.elasticUrl
    })

    this.quantity = 1
  }

  onBtnShowApp() {
    this.show = !this.show;
    if (this.show) {
      this.showHideAppBtn = 'Hide';
    } else {
      this.showHideAppBtn = 'Show';
    }
  }

  applicationSelected(appId: number) {
    this.applications.forEach(it => {
      if (appId == it.id){
        this.applicationName = it.name
      }
    })
    appId === 0 ? this.applicationId = null : this.applicationId = appId;
  }

  logFileTypeSelected(logFileType: string) {
    logFileType === "" ? this.logFileType = null : this.logFileType = logFileType;
  }


  uploadFiles(file) {
    this.formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      this.formData.append("file", file[i], file[i]['name']);
      this.applicationName = this.getAppName(file[i]['name'])
    }

    this.notificationService.success("Click the upload button to send the log file.")
  }

  getAppName(appName: string){
    return appName.replace(/\W/g, '')
  }

  requestSampleData() {
    this.isSpinning = true



    this.http.post(`/api/logs/${this.key}/sample_data`, {})
      .subscribe(resp => {
        this.isSpinning = false
        this.router.navigate(['/pages', 'dashboard'])
        this.tourService.start()
      }, error => {
        this.notificationService.error("Error: ", error)
      });
    this.formData = new FormData();
    this.ReqJson = {};
  }

    startTimer(seconds: number) {
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressValue = Number((sec * 100 / seconds).toPrecision(1));
      this.curSec = sec;
      if (this.curSec === seconds) {
        sub.unsubscribe();
        this.router.navigate(['/auth/login'])
      }
    });
  }

  onPythonBtn() {
    this.uploadFile = false
  }

  onDockerBtn() {
    this.uploadFile = false
  }

  onUploadBtn() {
    this.uploadFile = true
  }

  onRestBtn() {
    this.uploadFile = false
  }

  plus() {
    this.quantity++;
  }

  minus() {
    if (this.quantity > 1) {
      this.quantity--;
    }

  }


  checkElasticsearchConnection(){
    this.formElasticsearch.get('elasticsearchStartTime').setValue(this.startDateTime)
    this.formElasticsearch.get('elasticsearchEndTime').setValue(this.endDateTime)
    console.log(this.formElasticsearch.value)
    this.http.post(`/api/logs/test_elasticsearch`, this.formElasticsearch.value)
      .subscribe(resp => {
        this.isElasticConnection = true
        this.notificationService.success("Success", resp['detail'])
      }, error => {
        this.notificationService.error("Error", error['detail'])
      });
  }

  requestElasticsearchData(){
    this.formElasticsearch.get('elasticsearchStartTime').setValue(this.startDateTime)
    this.formElasticsearch.get('elasticsearchEndTime').setValue(this.endDateTime)
    this.http.post(`/api/logs/load_elasticsearch`, this.formElasticsearch.value)
      .subscribe(resp => {
        this.notificationService.success("Successfully connected to elasticsearch. Ingesting logs...")
        this.router.navigate(['/pages', 'log-compare'])
      }, error => {
        this.notificationService.error("Error, please check your elasticsearch URL and Index and try again.")
      });
  }

   onSavePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.createTimeRange(predefinedTime).subscribe(resp => this.loadPredefinedTimes())
  }
 loadPredefinedTimes() {
    this.dashboardService.getAllTimeRanges().subscribe(resp => this.predefinedTimes = resp)
  }


  onDateTimeSearch(event) {
    // localStorage.setItem('selectedTime', JSON.stringify(event));
    this.popover.hide();
    this.openDatePicker = false;
    let dateTimeType = 'absolute';
    if (event.relativeTimeChecked) {
      this.startDateTime = event.relativeDateTime
      this.endDateTime = 'now'
      dateTimeType = 'relative';
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = event.absoluteDateTime.startDateTime
      this.endDateTime = event.absoluteDateTime.endDateTime
    }
    // localStorage.setItem("selectedTime", JSON.stringify({ startTime: this.startDateTime, endTime: this.endDateTime, dateTimeType }))
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



  onLoadDemoApplications() {
      this.integrationService.createDemoApplications().subscribe(
        resp => { this.loadApplications() },
        error => { this.notificationService.error("There was an error while loading sample data, please contact us!") }
      )
  }

  // createApplication(appName) {
  //
  //   if (this.key) {
  //     this.integrationService.createApplication({name: appName, key: this.key}).subscribe(
  //       resp => {
  //         this.form.reset()
  //       }, error => {
  //       })
  //   }
  //
  //   // if (this.key) {
  //   //   this.integrationService.createApplication({ name: this.form.controls['name'].value, key: this.key }).subscribe(
  //   //     resp => {
  //   //       this.loadApplications();
  //   //       this.notificationService.success('Success', 'Application successfully created');
  //   //       this.form.reset()
  //   //     }, error => this.notificationService.error('Error', 'Please choose another name, the application already exists!'))
  //   // } else {
  //   //   this.notificationService.error('Error', 'Please choose another name, the application already exists!')
  //   // }
  // }


  loadApplications() {
    this.integrationService.loadApplications(this.key).subscribe(resp => this.applications = resp)
  }

  loadLogFileTypes() {
    this.integrationService.loadLogFileTypes().subscribe(resp => this.logFileTypes = resp)
  }


  onHighlight(e) {
    this.response = {
      language: e.language,
      relevance: e.relevance,
      second_best: e.second_best,
      top: e.top,
      value: e.value
    }
  }

  private getPythonCode() {
    return `Detailed description at
https://docs.logsight.ai/#/sdk_api/quick_start


import logging
from logsight import LogsightLogger

# Get an instance of Python standard logger.
logger = logging.getLogger("Python Logger")
logger.setLevel(logging.DEBUG)

PRIVATE_KEY = '${this.key}'
APP_NAME = 'string'
logsight_handler = LogsightLogger(PRIVATE_KEY,
                                  APP_NAME)
logsight_handler.setLevel(logging.INFO)

logger.addHandler(logsight_handler)

# Send message
logger.info("Hello World!")
logger.error("Hello Error!")
logger.warning("Hello Warning!")
logger.debug("Hello Debug!")
logger.info("Hello World!")
logger.info("Hello World!")
logger.info("Hello World!")
logger.error("Hello Error!")
logger.warning("Hello Warning!")
logger.debug("Hello Debug!")
logger.info("Hello World!")
logger.info("Hello World!")
logger.info("------------")`;
  }

  private getDockerCode() {
    return `
    filebeat.inputs:
      - type: log
        paths:
          - /var/log/*.log

      fields_under_root: true
      fields:
        PRIVATE_KEY: "${this.key}"
        APP_NAME: "string"

      output.logstash:
        hosts: ["logsight.ai:12350"]`;
  }


  private getCodeUpload(){
    return `
logsight.ai supports ingestion and automatic parsing
of large variety of log files.
    `
  }


  private getCodeRest() {
    return `
//sending log messages

//get authorization token

curl -X POST
-H 'Content-Type: application/json'
--data '{"email": "info@logsight.ai",
 "password": "superPassword"}'
 http://localhost:4200/api/auth/login

//send log messages in a batch
curl --location --request POST
'http://localhost:4200/logs/`+this.key+`
/APP/send_logs'
--header 'Authorization: Bearer token_example'
--header 'Content-Type: text/plain'
--data-raw '["This is a log message",
"This is another log message"]'

//send log files
curl -X POST
-H "Authorization: Bearer example_token"
-F "file=@/home/user/test.log"
http://localhost:4200/api/logs/
`+this.key+`/APP/upload_file`
  }


}
