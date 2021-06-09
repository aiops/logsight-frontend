import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  constructor(private authService: LoginService,
              private notificationService: NotificationsService,
              private router: Router) {
  }

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('demo')
  });

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
  }

  onLogin() {
    this.authService.login(this.form.value).subscribe(resp => {
        this.router.navigate(['/pages/dashboard'])
      }, err => {
        console.log('login error', err)
        this.notificationService.error('Error', 'Incorrect or not activated email')
      }
    )
  }

}
