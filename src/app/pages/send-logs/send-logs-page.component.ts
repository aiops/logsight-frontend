import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../auth/authentication.service";
import {Application} from "../../@core/common/application";
import {Router} from "@angular/router";
import {LogsightUser} from "../../@core/common/logsight-user";

@Component({
  selector: 'send-logs', styleUrls: ['./send-logs-page.component.scss'], templateUrl: './send-logs-page.component.html',
})
export class SendLogsPage implements OnInit {
  user: LogsightUser
  progressValue: number;
  curSec: number;
  progressIsHidden: boolean;
  applications: Application[] = [];
  next: number;


  constructor(private authService: AuthenticationService, private router: Router) {

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

  redirectToSampleData() {
    this.router.navigate(['pages', 'demo-data'])
  }


  redirectToSwagger() {
    window.open('https://docs.logsight.ai/#/incident_detection/using_the_rest_api?id=send-logs', '_blank' // <- This is what makes it open in a new window.
    );
  }

  redirectToGithub() {
    window.open('https://docs.logsight.ai/#/integration/github_action', '_blank' // <- This is what makes it open in a new window.
    );
  }

  redirectToLogstash() {
    window.open('https://docs.logsight.ai/#/./integration/logstash?id=logstash', '_blank' // <- This is what makes it open in a new window.
    );
  }

  redirectToFluentbit() {
    window.open('https://docs.logsight.ai/#/./integration/fluentbit?id=fluentbit', '_blank' // <- This is what makes it open in a new window.
    );
  }


}
