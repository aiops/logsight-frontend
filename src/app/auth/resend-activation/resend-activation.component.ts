import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from "../../@core/service/api.service";
import {NbThemeService} from "@nebular/theme";

@Component({
  selector: 'resend-activation',
  styleUrls: ['./resend-activation.component.scss'],
  templateUrl: './resend-activation.component.html',
})
export class ResendActivationComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl('', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
  });
  isEmailSent: boolean = false;
  emailNotFound: boolean = false;
  isSpinning: boolean = false;

  constructor(
    private authService: LoginService,
    private notificationService: NotificationsService,
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private themeService: NbThemeService
  ) {
  }

  ngOnInit(): void {
    //hack code to stop spinner
    this.themeService.changeTheme("default");
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
  }

  onResendActivation() {
    this.isSpinning = true
    this.authService.resendActivation(this.form.value).subscribe(resp => {
        this.isEmailSent = true;
        this.isSpinning = false;
        this.notificationService.success('Success', 'New activation email was sent.', this.apiService.getNotificationOpetions())
      }, error => {
        this.emailNotFound = true;
        this.isSpinning = false;
        this.apiService.handleErrors(error)
      }
    )
  }

}
