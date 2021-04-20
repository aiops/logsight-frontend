import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '../../@core/common/application';
import { IntegrationService } from '../../@core/service/integration.service';
import { HighlightResult } from 'ngx-highlightjs';

@Component({
  selector: 'integration',
  styleUrls: ['./integration.page.scss'],
  templateUrl: './integration.page.html',
})
export class IntegrationPage implements OnInit {
  key: string
  email: string
  applications: Application[] = [];
  public show:boolean = false;
  public python:boolean = true;
  public fileBeats:boolean = false;
  public showHideAppBtn:any = 'Show';
  public pythonBtn:any = 'Python';
  public filebeatBtn:any = 'Filebeat';
  public restBtn:any = 'Rest';
  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  response: HighlightResult;

  code_python = ''
  code_filebeats = ''

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
      this.loadApplications()
      this.code_python = this.getPythonCode()
      this.code_filebeats = this.getFilebeatsCode()
    })
  }

  onBtnShowApp() {
    this.show = !this.show;
    if(this.show)
      this.showHideAppBtn = "Hide";
    else
      this.showHideAppBtn = "Show";
  }


  onPythonBtn(){
    this.python = true
    this.fileBeats = false
  }

  onFileBeatBtn(){
    this.python = false
    this.fileBeats = true
  }

  onRestBtn(){

  }

  createApplication() {
    if (this.key) {
      this.integrationService.createApplication({ name: this.form.controls['name'].value, key: this.key }).subscribe(
        resp => {
          this.loadApplications()
          this.notificationService.success('Success', 'Application successfully created')
        }, error => this.notificationService.error('Error', 'Sorry, a problem happened'))
    } else {
      this.notificationService.error('Error', 'Sorry, a problem happened')
    }
  }

  loadApplications() {
    this.integrationService.loadApplications(this.key).subscribe(resp => this.applications = resp)
  }

  onHighlight(e) {
    this.response = {
      language: e.language,
      relevance: e.relevance,
      second_best: '{...}',
      top: '{...}',
      value: '{...}'
    }
  }

  private getPythonCode() {
    return `import logging
from logsight import LogsightLogger

# Get an instance of Python standard logger.
logger = logging.getLogger("Python Logger")
logger.setLevel(logging.DEBUG)

PRIVATE_KEY = '${this.key}'
APP_NAME = 'demo-app'
logsight_handler = LogsightLogger(PRIVATE_KEY, APP_NAME)
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

  private getFilebeatsCode() {
    return "filebeat.inputs:\n" +
        "- type: log\n" +
        "  paths:\n" +
        "    - /var/log/*.log\n" +
        "\n" +
        "fields_under_root: true\n" +
        "fields:\n" +
        "  PRIVATE_KEY: \"0i9wnjlvgzhdsqevfpjkitvaaq\"\n" +
        "  APP_NAME: \"demo-app\"\n" +
        "\n" +
        "output.logstash:\n" +
        "  hosts: [\"logsight.ai:12350\"]";
  }
}
