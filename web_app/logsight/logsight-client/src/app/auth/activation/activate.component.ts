import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { LogsightUser } from '../../@core/common/logsight-user';
import {interval} from "rxjs";

@Component({
  selector: 'activate',
  styleUrls: ['./activate.component.scss'],
  templateUrl: './activate.component.html',
})
export class ActivateComponent implements OnInit {
  user: LogsightUser;
  activationSuccess: boolean;
  loading = true;
  email: string;
  progressValue: number;
  curSec: number;

  constructor(private authService: LoginService,
              private notificationService: NotificationsService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  startTimer(seconds: number) {
    const time = seconds;
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressValue = Number((sec * 100 / seconds).toPrecision(1));
      this.curSec = sec;
      if (this.curSec === seconds) {
        sub.unsubscribe();
        this.router.navigate(['/pages/dashboard'])
      }
    });
  }

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }

    this.route.params
      .subscribe(params => {

        if (params.key) {
          this.authService.activateUser(params.key).subscribe(user => {
            this.user = user
            this.activationSuccess = true;
            this.loading = false
            this.email = this.user.email
            this.authService.login({email:this.email, password:'demo'}).subscribe(resp => {
                this.startTimer(10)
              }, err => {
                console.log('login error', err)
                this.notificationService.error('Error', 'Incorrect or not activated email')
              }
            )
          })
        }
      }, error => {
        this.activationSuccess = false;
        this.loading = false
      })


  }
}
