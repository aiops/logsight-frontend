import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {ApiService} from "../../@core/service/api.service";

@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('demo')
  });

  constructor(private authService: LoginService,
              private notificationService: NotificationsService,
              private router: Router,
              private apiService: ApiService) {
  }

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
  }

  onLogin() {
    localStorage.removeItem('token')
    this.authService.loginLink(this.form.value).subscribe(resp => {
        this.notificationService.success('Success', 'Please check your email for a login link!')
      }, err => {
        console.log('login error', err)
        this.notificationService.error('Error', 'Incorrect or not activated email')
      }
    )
  }

}
