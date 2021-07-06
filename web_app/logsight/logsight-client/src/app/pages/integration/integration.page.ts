import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '../../@core/common/application';
import { IntegrationService } from '../../@core/service/integration.service';
import { HighlightResult } from 'ngx-highlightjs';
import { loadStripe } from '@stripe/stripe-js/pure';

@Component({
  selector: 'integration',
  styleUrls: ['./integration.page.scss'],
  templateUrl: './integration.page.html',
})
export class IntegrationPage implements OnInit {
  key: string;
  email: string;
  quantity: number;
  hasPaid: Boolean;
  applications: Application[] = [];
  public show: boolean = false;
  public python: boolean = false;
  public fileBeats: boolean = false;
  public rest: boolean = true;
  public showHideAppBtn: any = 'Show';
  public pythonBtn: any = 'Python';
  public filebeatBtn: any = 'Filebeat';
  public restBtn: any = 'REST API';
  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  response: HighlightResult;
  customerId = ''
  code_python = ''
  code_filebeats = ''
  code_rest = ''
  stripePromise = loadStripe(
    'pk_test_51ILUOvIf2Ur5sxpSWO3wEhlDoyIWLbsXHYlZWqAGYinErMW59auHgqli7ASHJ7Qp7XyRFZjrTEAWWUbRBm3qt4eb00ByhhRPPp');

  constructor(private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
      this.hasPaid = user.hasPaid
      this.loadApplications()
      this.code_python = this.getPythonCode()
      this.code_filebeats = this.getFilebeatsCode()
      this.code_rest = this.getCodeRest()
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

  onPythonBtn() {
    this.python = true
    this.fileBeats = false
    this.rest = false
  }

  onFileBeatBtn() {
    this.python = false
    this.fileBeats = true
    this.rest = false
  }

  onRestBtn() {
    this.python = false
    this.fileBeats = false
    this.rest = true
  }

  plus() {
    this.quantity++;
  }

  minus() {
    if (this.quantity > 1) {
      this.quantity--;
    }

  }

  createApplication() {
    if (this.key) {
      this.integrationService.createApplication({ name: this.form.controls['name'].value, key: this.key }).subscribe(
        resp => {
          this.loadApplications();
          this.notificationService.success('Success', 'Application successfully created');
          this.form.reset()
        }, error => this.notificationService.error('Error', 'Sorry, a problem happened'))
    } else {
      this.notificationService.error('Error', 'Sorry, a problem happened')
    }
  }

  loadApplications() {
    this.integrationService.loadApplications(this.key).subscribe(resp => this.applications = resp)
  }

  async stripeCLick() {
    const payment = {
      name: 'LogsightPayment',
      currency: 'eur',
      quantity: this.quantity,
      amount: 999,
      email: this.email,
      priceID: 'price_1J2tf6If2Ur5sxpSCxAVA2eW',
      cancelUrl: 'http://localhost:4200/pages/integration',
      successUrl: 'http://localhost:4200/pages/integration',
    };
    const stripe = await this.stripePromise;
    this.integrationService.subscription(payment).subscribe(data => {
      this.customerId = data.id;
      stripe.redirectToCheckout({
        sessionId: data.id
      })
    });
  }

  async stripeCustomerPortal() {
    const stripe = await this.stripePromise;
    this.integrationService.checkCustomerPortal().subscribe(data => {
      window.open(data['url'], "_blank");
    });
  }

  onHighlight(e) {
    this.response = {
      language: e.language,
      relevance: e.relevance,
      second_best: e.second_best,
      top: e.top,
      value: e.value
    }
    console.log(this.response)
  }

  private getPythonCode() {
    return `import logging
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

  private getFilebeatsCode() {
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

  private getCodeRest() {
    return `
    //json
    {
    "logMessages": [
      {
        "private-key": "${this.key}",
        "app": "string",
        "timestamp": "string",
        "level": "string",
        "message": "string"
      }
    ]
    }
    //curl command
    curl -X POST "https://logsight.ai/api_v1/data"
    -H "accept: application/json"
    -H "Content-Type: application/json"
    -d "{ \"logMessages\":
    [ { \"private-key\": \"${this.key}\",
        \"app\": \"string\",
        \"timestamp\": \"string\",
        \"level\": \"string\",
         \"message\": \"string\"
      }
    ]
    }"
    `
  }

  removeApplication(id: number) {
    this.integrationService.deleteApplication(id).subscribe(
      () => {
        this.notificationService.success('Success', 'Application successfully deleted')
        this.loadApplications()
      }, err => {
        this.notificationService.error('Error', 'Application not deleted');
        console.log(err)
      })
  }
}
