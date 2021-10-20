import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from "../../@core/service/api.service";
import {UserLoginFormId} from "../../@core/common/auth/userLoginFormId";

@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl('', Validators.required),
  });

  constructor(
    private authService: LoginService,
    private notificationService: NotificationsService,
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }

    this.route.params.subscribe(params => {
      if (params.id && params.password) {
        const loginForm: UserLoginFormId = {
          id: params.id,
          password: params.password
        }
        this.authService.loginId(loginForm).subscribe(user => {
          this.router.navigate(['/pages/dashboard'])
        }, err => {

          this.notificationService.error('Error', 'Incorrect or not activated email')
        })
      }
    }, error => {
    })
  }

  onLogin() {
    localStorage.removeItem('token')
    this.authService.requestLoginLink(this.form.value).subscribe(resp => {
        this.notificationService.success('Success', 'Please check your email for a login link!')
      }, err => {

        this.notificationService.error('Error', 'Incorrect or not activated email')
      }
    )
  }

}

/*else {
  this.status = 'login'
  this.authService.userLoginLink(params.key).subscribe(user => {
    this.user = user
    this.activationSuccess = true;
    this.loading = false
    this.email = this.user.email
    this.authService.login({email: this.email, password: 'demo'}).subscribe(resp => {
        this.router.navigate(['/pages/dashboard'])
      }, err => {
        console.log('login error', err)
        this.notificationService.error('Error', 'Incorrect or not activated email')
      }
    )
  })
}*/
