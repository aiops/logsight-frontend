import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {interval} from "rxjs";
import {NbThemeService} from "@nebular/theme";

@Component({
  selector: 'register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  formSubmitted = false;
  progressValue = 0
  email = ""
  curSec = 0

  loginForm = new FormGroup({
    email: new FormControl('', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
    password: new FormControl('', Validators.compose([
		Validators.required,
		Validators.minLength(8)
	]))
  });


  form = new FormGroup({
    email: new FormControl('', Validators.compose([
		Validators.required,
		Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
	])),
    password: new FormControl('', Validators.compose([
		Validators.required,
		Validators.minLength(8)
	])),
    retryPassword: new FormControl('', Validators.compose([
		Validators.required,
		Validators.minLength(8)
	]))
  });
  isSpinning = false;
  constructor(private authService: LoginService, private router: Router,
              private notificationService: NotificationsService, private route: ActivatedRoute, private themeService: NbThemeService) {
  }

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
    this.form.get("email").setValue("client_admin@logsight.ai")
    this.form.get("password").setValue("samplepass")
    this.form.get("retryPassword").setValue("samplepass")
    this.loginForm.get("email").setValue("client_admin@logsight.ai")
    this.loginForm.get("password").setValue("samplepass")

    this.onSignUp()
    this.themeService.changeTheme("default");
  }

  onSignUp() {
    this.isSpinning = true;

    this.authService.register(this.form.value).subscribe(resp => {
      this.isSpinning = false;
      this.formSubmitted = true;
      this.authService.login(this.loginForm.value).subscribe(resp => {
        this.router.navigate(['/pages/dashboard'])
      })
      }, err => {
        console.log("AS")
      localStorage.removeItem('token')
        this.authService.login(this.loginForm.value).subscribe(resp => {
        this.router.navigate(['/pages/dashboard'])
        }, err => {
          console.log("AA:", err)
        }
      )
      }, () => {
      console.log("ASD")
      this.authService.login(this.loginForm.value).subscribe(resp => {
        this.router.navigate(['/pages/dashboard'])
      }, err => {
          console.log("AA:", err)
        })
    })
  }
}
