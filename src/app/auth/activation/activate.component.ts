import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {LogsightUser} from '../../@core/common/logsight-user';
import {interval} from "rxjs";
import {NbThemeService} from "@nebular/theme";
import {ApiService} from "../../@core/service/api.service";

@Component({
  selector: 'activate',
  styleUrls: ['./activate.component.scss'],
  providers: [],
  templateUrl: './activate.component.html',
})
export class ActivateComponent implements OnInit {
  user: LogsightUser = null;
  activationSuccess: boolean = false;
  loading: boolean = true;
  progressValue: number = 0;
  curSec: number = 0;
  status: string = "default"

  constructor(
    private authService: LoginService,
    private notificationService: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: NbThemeService,
    private apiService: ApiService
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
    this.route.queryParams.subscribe(params => {
      if (params.uuid && params.token) {
        const activateForm = {"id": params.uuid, "activationToken": params.token}
        this.authService.activate(activateForm).subscribe(user => {
          this.user = user
          this.activationSuccess = true;
          this.loading = false
          this.status = "activate"
          this.startTimer(5)
          this.notificationService.success("Success", "User activated. Please login.")
        }, error => {
          this.apiService.handleErrors(error)
        })
      }
    }, error => {
      this.apiService.handleErrors(error)
    })
  }
}
