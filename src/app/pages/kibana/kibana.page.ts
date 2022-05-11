import { Component, OnInit } from '@angular/core';
import {interval} from "rxjs";
import {AuthenticationService} from "../../auth/authentication.service";
import {ApiService} from "../../@core/service/api.service";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

import {UserActivateForm} from "../../@core/common/auth/userActivateForm";
import {UserLoginFormId} from "../../@core/common/auth/userLoginFormId";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../auth/login.service";
import {NotificationsService} from "angular2-notifications";


@Component({
  selector: 'kibana',
  styleUrls: ['./kibana.page.scss'],
  templateUrl: './kibana.page.html',
})
export class KibanaPage implements OnInit {
  progressValue: number;
  curSec: number;
  key: string;
  email: string;
  reloadNum: number;
  environment = environment
  kibanaUrl: SafeResourceUrl;


  loginForm: UserLoginFormId = {
          id: 0,
          password: ""
        }

  constructor(private authService: LoginService, private apiService: ApiService, public sanitizer:DomSanitizer, private router: Router,
    private route: ActivatedRoute, private notificationService: NotificationsService) {

    this.curSec = 0;
    this.reloadNum = 0;
    this.environment = environment;
  }



  // alerting() {
  //   alert(`To log into your kibana, use your user key as username and 'test-test' as initial password. You can find your key in your profile, and change the password in your kibana user settings! \n
  //     username: ${this.key} \n
  //     initial password: test-test`);
  //   prompt("Copy key CTRL+C:", this.key)
  // }
  //
  // startTimer(seconds: number) {
  //   const time = seconds;
  //   const timer$ = interval(1000);
  //   const sub = timer$.subscribe((sec) => {
  //     this.progressValue = Number((sec * 100 / seconds).toPrecision(1));
  //     this.curSec = sec;
  //     if (this.curSec === seconds) {
  //       sub.unsubscribe();
  //       // this.alerting()
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.delay( 3000)


    // this.apiService.get(`/api/applications/update_kibana_patterns`).subscribe(resp => {
    //
    // });

  }

  delay(ms: number) {
    return new Promise( resolve => {
      setTimeout(()=>{
        if (window.location.href.toString().includes("demo")){
      this.kibanaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.kibanaUrl)
    } else {
      this.kibanaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.kibanaUrl)
    }
      }, ms)
    } );
}
}
