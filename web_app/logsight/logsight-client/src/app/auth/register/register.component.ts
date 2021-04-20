import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbLoginComponent, NbRegisterComponent } from '@nebular/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  constructor(private authService: LoginService, private router: Router,
              private notificationService: NotificationsService) {
    //let btn = document.getElementById("registrationButton");
    //btn.addEventListener("click", (e:Event) => this.onRegister());
  }

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
  }

  onRegister() {
    this.authService.register(this.form.value).subscribe(resp => {
        this.notificationService.success('Success', 'You are successfully registered')
        this.router.navigate(['/auth/login'])

      }
    )
  }

}
