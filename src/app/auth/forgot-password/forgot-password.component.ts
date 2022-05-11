import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {ApiService} from "../../@core/service/api.service";
import {NbThemeService} from "@nebular/theme";

@Component({
  selector: 'login',
  styleUrls: ['./forgot-password.component.scss'],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
  });
  isEmailSent: boolean = false;
  emailNotFound: boolean = false;
  isSpinning: boolean = false;

  constructor(
    private authService: LoginService,
    private notificationService: NotificationsService,
    private apiService: ApiService,
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


  onForgotPassword() {
    this.isSpinning = true
    localStorage.removeItem('token')
    this.authService.onForgotPassword(this.form.value.email).subscribe(resp => {
        this.isEmailSent = true;
        this.isSpinning = false;
        this.notificationService.success('Success', 'New password was sent to your email.', this.apiService.getNotificationOpetions())
      }, error => {
        this.emailNotFound = true;
        this.isSpinning = false;
        this.apiService.handleErrors(error)
      }
    )
  }

}

