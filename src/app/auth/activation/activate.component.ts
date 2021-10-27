import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {LogsightUser} from '../../@core/common/logsight-user';
import {interval} from "rxjs";
import {UserActivateForm} from "../../@core/common/auth/userActivateForm";
import {DashboardService} from "../../pages/dashboard/dashboard.service";
import {IntegrationService} from "../../@core/service/integration.service";
import {UserLoginFormId} from "../../@core/common/auth/userLoginFormId";
import {NbThemeService} from "@nebular/theme";

@Component({
  selector: 'activate',
  styleUrls: ['./activate.component.scss'],
  providers: [DashboardService, IntegrationService],
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
    private dashboardService: DashboardService,
    private integrationService: IntegrationService,
    private notificationService: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: NbThemeService
  ) {
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

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }

    this.themeService.changeTheme("default")
    this.route.params.subscribe(params => {
      if (params.id && params.key) {
        const activateForm: UserActivateForm = {
          id: params.id,
          key: params.key
        }
        // const loginForm: UserLoginFormId = {
        //   id: params.id,
        //   password: params.password
        // }
        this.authService.activate(activateForm).subscribe(user => {
          this.user = user
          this.activationSuccess = true;
          this.loading = false
          this.email = this.user.email
          this.status = "activate"
          this.startTimer(5)
          // this.authService.loginId(loginForm).subscribe(resp => {
          //
          //   this.dashboardService.createPredefinedTimeRange().subscribe(
          //     resp => {
          //     },
          //     error => {
          //     }
          //   )
          //   this.integrationService.createDemoApplications().subscribe(
          //     resp => {
          //     },
          //     error => {
          //
          //     }
          //   )

          // }, err => {
          //
          //   this.notificationService.error('Error', 'Incorrect or not activated email')
          // })
        this.notificationService.success("Success", "User activated. Please login.")
        // this.router.navigate(['/auth/login'])
        }, error => {
          this.notificationService.error(
            "Error",
            "An error occurred. User does not exist, please sign up."
          )
        })
      }
    }, error => {
      this.activationSuccess = false;
      this.loading = false
    })
  }
}
