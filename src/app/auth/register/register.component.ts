import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {Router} from '@angular/router';
import {NbThemeService} from "@nebular/theme";
import {ApiService} from "../../@core/service/api.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  formSubmitted: boolean = false;
  email: string = ""
  progressValue: number = 0
  curSec: number = 0
  isSpinning: boolean = false;

  form = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8)
    ])),
    repeatPassword: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8)
    ]))
  });


  constructor(private authService: LoginService,
              private router: Router,
              private apiService: ApiService,
              private themeService: NbThemeService) {
  }

  ngOnInit(): void {
    this.themeService.changeTheme("default");
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
  }


  onSignUp() {
    this.isSpinning = true;
    this.authService.register(this.form.value).subscribe(resp => {
        this.isSpinning = false;
        this.formSubmitted = true;
        this.router.navigate(['/auth/login'])
      }, error => {
        this.isSpinning = false;
        this.apiService.handleErrors(error)
        this.router.navigate(['/auth/register'])
      }
    )
  }

}
