import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'ingest_logs',
  styleUrls: ['./integration.page.scss'],
  templateUrl: './integration.page.html',
})
export class IntegrationPage implements OnInit {
  key: string;
  email: string;
  quantity: number;
  hasPaid: Boolean;
  applicationId: number;
  logFileType: String;
  applications: Application[] = [];
  logFileTypes: LogFileType[] = [];
  applicationName: String;
  public show: boolean = false;
  public python: boolean = false;
  public docker: boolean = false;
  public rest: boolean = true;
  public uploadFile: boolean = false;
  public showHideAppBtn: any = 'Show';
  public pythonBtn: any = 'Python SDK';
  public dockerBtn: any = 'Docker';
  public loadDemoAppBtn: any = 'Load sample';
  public uploadBtn: any = 'Upload log file';
  public restBtn: any = 'REST API';
  format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+/;
  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });


  public formData = new FormData();
  ReqJson: any = {};

  response: HighlightResult;
  customerId = ''
  code_python = ''
  code_docker = ''
  code_rest = ''
  code_upload = ''


  constructor(private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService, private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
      this.hasPaid = user.hasPaid
      this.loadApplications()
      this.loadLogFileTypes()
      this.code_python = this.getPythonCode()
      this.code_docker = this.getDockerCode()
      this.code_rest = this.getCodeRest()
      this.code_upload = this.getCodeUpload()
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
    }
    this.notificationService.success("Click the upload button to send the log file.")
  }


  RequestUpload() {
    this.http.post(`/api/logs/${this.key}/${this.applicationName}/upload_file`, this.formData)
      .subscribe(resp => {
        this.notificationService.success("Log data uploaded successfully!")
      }, error => {
        this.notificationService.error("Error: ", error.error.detail)
      });
    this.formData = new FormData();
    this.ReqJson = {};
    this.router.navigate(['/pages', 'dashboard'])
  }

  onPythonBtn() {
    this.python = true
    this.docker = false
    this.rest = false
    this.uploadFile = false
  }

  onDockerBtn() {
    this.python = false
    this.docker = true
    this.rest = false
    this.uploadFile = false
  }

  onUploadBtn() {
    this.python = false
    this.docker = false
    this.rest = false
    this.uploadFile = true
  }

  onRestBtn() {
    this.python = false
    this.docker = false
    this.rest = true
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

  onLoadDemoApplications() {
      this.integrationService.createDemoApplications().subscribe(
        resp => { this.loadApplications() },
        error => { this.notificationService.error("There was an error while loading sample data, please contact us!") }
      )
  }

  createApplication() {
    var app_name = this.form.controls['name'].value.toString()

    if (this.key) {
      this.integrationService.createApplication({name: this.form.controls['name'].value, key: this.key}).subscribe(
        resp => {
          this.loadApplications();
          this.notificationService.success('Success', 'Application successfully created');
          this.form.reset()
        }, error => {
          this.notificationService.error('Error', error.detail)
        })
    } else {
      this.notificationService.error('Error', 'No key. Please log in.')
    }


    // if (this.key) {
    //   this.integrationService.createApplication({ name: this.form.controls['name'].value, key: this.key }).subscribe(
    //     resp => {
    //       this.loadApplications();
    //       this.notificationService.success('Success', 'Application successfully created');
    //       this.form.reset()
    //     }, error => this.notificationService.error('Error', 'Please choose another name, the application already exists!'))
    // } else {
    //   this.notificationService.error('Error', 'Please choose another name, the application already exists!')
    // }
  }

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

  removeApplication(id: number) {
    this.integrationService.deleteApplication(id).subscribe(
      resp => {
        this.notificationService.success('Success', 'Application successfully deleted')
        this.loadApplications()
      }, err => {
        this.notificationService.error('Error', 'Application not deleted');
      })
  }
}
