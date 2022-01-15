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

    this.route.queryParamMap.subscribe(queryParams => {
      this.form.get("email").setValue(queryParams.get("email"))
    });
    this.themeService.changeTheme("default");
  }

  // onRegister() {
  //   this.authService.register(this.form.value).subscribe(resp => {
  //       this.notificationService.success('Success', 'You are successfully registered')
  //       this.router.navigate(['/auth/login'])
  //     }
  //   )
  // }
  startTimer(seconds: number) {
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressValue = Number((sec * 100 / seconds).toPrecision(1));
      this.curSec = sec;
      if (this.curSec === seconds) {
        sub.unsubscribe();
        this.router.navigate(['/'])
      }
    });
  }
  onSignUp() {
    this.isSpinning = true;
    this.authService.register(this.form.value).subscribe(resp => {
      this.isSpinning = false;
        this.notificationService.success('Success',
          'You are successfully registered. Please check your email to activate and then login')
      this.formSubmitted = true;
      // this.startTimer(5)
      }, err => {
        this.notificationService.error('Error', 'User already exists, please login!')
      this.router.navigate(['/auth/login'])
      }
    )
  }

}
