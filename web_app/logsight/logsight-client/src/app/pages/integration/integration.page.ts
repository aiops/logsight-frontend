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
  public rest:boolean = false;
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
  code_rest = ''

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
      this.code_rest = this.getCodeRest()
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
    this.rest = false
  }

  onFileBeatBtn(){
    this.python = false
    this.fileBeats = true
    this.rest = false
  }

  onRestBtn(){
    this.python = false
    this.fileBeats = false
    this.rest = true
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
    return `
    filebeat.inputs:
      - type: log
        paths:
          - /var/log/*.log

      fields_under_root: true
      fields:
        PRIVATE_KEY: "${this.key}"
        APP_NAME: "demo-app"

      output.logstash:
        hosts: ["logsight.ai:12350"]`;
  }

  private getCodeRest(){
    return `
    //json
    {
    "private-key": "${this.key}",
    "app": "demo-app",
    "message": "This is an error message, representing failure!",
    "level": "ERROR"
    }

    //shell script
    #!/bin/bash
    while IFS= read -r line; do
      curl -X POST "https://logsight.ai/api_v1/data"
      -H "accept: application/json"
      -H "Content-Type: application/json"
      -d "{ \\"private-key\\": \\"${this.key}\\",
      \\"app\\": \\"demo-app\\", \\"message\\": \\"$line\\",
       \\"level\\": \\"string\\"}"
      echo "Text read from file: $line"
    done < "$1"


    // to use the shell script just
    // copy the above shell code into send-rest.sh
    // ./send-rest.sh File_name
    `
  }
}
