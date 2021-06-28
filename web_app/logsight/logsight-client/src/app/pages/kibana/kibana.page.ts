import { Component, OnInit } from '@angular/core';
import {interval} from "rxjs";
import {AuthenticationService} from "../../auth/authentication.service";
import {ApiService} from "../../@core/service/api.service";
import {HttpHeaders} from "@angular/common/http";

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

  constructor(private authService: AuthenticationService, private apiService: ApiService) {
    this.curSec = 0;
    this.reloadNum = 0;

  }



  alerting() {
    alert(`To log into your kibana, use your user key as username and 'test-test' as initial password. You can find your key in your profile, and change the password in your kibana user settings! \n
      username: ${this.key} \n
      initial password: test-test`);
    prompt("Copy key CTRL+C:", this.key)
  }
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


  }
}
