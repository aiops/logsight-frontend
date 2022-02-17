import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from "../../@core/service/api.service";
import {NbThemeService} from "@nebular/theme";

@Component({
  selector: 'reset-password',
  styleUrls: ['./reset-password.component.scss'],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {

  formPassword = new FormGroup({
    userId: new FormControl(''),
    passwordResetToken: new FormControl(''),
    password: new FormControl('', Validators.minLength(8)),
    repeatPassword: new FormControl('', Validators.minLength(8))
  });

  isEmailSent: boolean = false;
  emailNotFound: boolean = false;
  isSpinning: boolean = false;
  isMatching: boolean = true;
  token: string = ""
  id: string = ""

  constructor(
    private notificationService: NotificationsService,
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private themeService: NbThemeService,
    private loginService: LoginService
  ) {
  }

  ngOnInit(): void {
    //hack code to stop spinner
    this.themeService.changeTheme("default");
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }

    this.route.queryParams.subscribe(params => {
      if (params.uuid && params.token) {
        this.token = params.token
        this.id = params.uuid
      }
    }, error => {
      this.apiService.handleErrors(error)
    })

  }

  resetPassword() {
    let newPassword = this.formPassword.value.password
    let repeatNewPassword = this.formPassword.value.repeatPassword
    this.formPassword.get("passwordResetToken").setValue(this.token)
    this.formPassword.get("userId").setValue(this.id)
    if (newPassword != repeatNewPassword) {
      this.isMatching = false
    } else {
      this.isMatching = true
      this.loginService.resetPassword(this.formPassword.value).subscribe(resp => {
        this.notificationService.success("Success", "The password was successfully updated.", this.apiService.getNotificationOpetions())
        this.router.navigate([''])
      }, error => {
        this.apiService.handleErrors(error)
      })
    }
  }
}
