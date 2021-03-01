import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { LoginService } from '../auth/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'landing',
  styleUrls: ['.assets/css/animate.css', '.assets/css/owl.carousel.css', '.assets/css/owl.theme.css', '.assets/css/style.css'],
  templateUrl: './landing.page.html',
})
export class LandingPage {

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('demo')
  });
  message = '';

  constructor(private authService: LoginService,
              private notificationService: NotificationsService,
              private router: Router) {
  }

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
  }

  onLogin() {
    this.authService.login(this.form.value).subscribe(resp => {
      if (resp?.key) {
        localStorage.setItem('key', resp.key);
        this.router.navigate(['/pages/dashboard'])
      } else {
        this.notificationService.error('Error', 'Incorrect email or password')
      }
    })
  }

  onSignUp() {
    this.authService.registerDemo(this.form.value).subscribe(resp => {
        this.notificationService.success('Success',
          'You are successfully registered. Please check your email to activate')
        this.router.navigate(['/auth/login'])
      }
    )
  }

}

