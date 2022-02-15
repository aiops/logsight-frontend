import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from "../../@core/service/api.service";
import {NbThemeService} from "@nebular/theme";


@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl('', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]))
  });

  notificationServiceTimeOut = 6000

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
    this.themeService.changeTheme("default");
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
  }


  onLogin() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    this.authService.login(this.form.value).subscribe(resp => {
      localStorage.setItem("userId", resp.user.id)
        this.route.queryParamMap.subscribe(
          queryParams => {
            let redirectUrl = "/pages/send-logs"
            this.router.navigate([redirectUrl]).then(() => {
            });
          }
        )
      }, error => {
        if (error.status == 409) {
          this.apiService.handleErrors(error)
          this.router.navigate(['auth', 'resend-activation'])
        } else {
          this.apiService.handleErrors(error)
        }
      }
    )
  }

}
