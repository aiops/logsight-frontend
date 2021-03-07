import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { LogsightUser } from '../../@core/common/logsight-user';

@Component({
  selector: 'activate',
  styleUrls: ['./activate.component.scss'],
  templateUrl: './activate.component.html',
})
export class ActivateComponent implements OnInit {
  user: LogsightUser;
  activationSuccess: boolean;
  loading = true

  constructor(private authService: LoginService,
              private notificationService: NotificationsService,
              private router: Router,
              private route: ActivatedRoute) {
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
          })
        }
      }, error => {
        this.activationSuccess = false;
        this.loading = false
      })
  }
}