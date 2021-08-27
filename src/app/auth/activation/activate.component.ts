import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {LogsightUser} from '../../@core/common/logsight-user';
import {interval} from "rxjs";
import {UserActivateForm} from "../../@core/common/auth/userActivateForm";
import {UserLoginForm} from "../../@core/common/auth/userLoginForm";
import {log} from "util";

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
  status = "default"

  constructor(
    private authService: LoginService,
    private notificationService: NotificationsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  startTimer(seconds: number) {
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

    this.route.params.subscribe(params => {
      if (params.id && params.key && params.password) {
        const activateForm: UserActivateForm = {
          id: params.id,
          key: params.key
        }
        const loginForm: UserLoginForm = {
          id: params.id,
          password: params.password
        }
        this.authService.activate(activateForm).subscribe(user => {
          this.user = user
          this.activationSuccess = true;
          this.loading = false
          this.email = this.user.email
          this.authService.login(loginForm).subscribe(resp => {
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
