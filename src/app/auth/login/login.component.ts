import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from "../../@core/service/api.service";
import {UserLoginFormId} from "../../@core/common/auth/userLoginFormId";
import {NbThemeService} from "@nebular/theme";

@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl('', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
    password: new FormControl('', Validators.compose([
		Validators.required,
		Validators.minLength(8)
	]))
  });

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
    //hack code to stop spinner
    this.themeService.changeTheme("default");
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }

    // this.route.params.subscribe(params => {
    //   let redirectUrl: string;
    //   if (params.id && params.password) {
    //     const loginForm: UserLoginFormId = {
    //       id: params.id,
    //       password: params.password
    //     }
    //     this.authService.loginId(loginForm).subscribe(user => {
    //        this.route.queryParamMap.subscribe(
    //     queryParams => {
    //       if (queryParams.has("redirect")){
    //         redirectUrl = '/pages/kibana'
    //       //   this.apiService.post("/api/auth/kibana/login",
    //       // '{"key":"'+ user.key + '"}').subscribe(async data => {
    //       //   })
    //       }else{
    //         redirectUrl = '/pages/dashboard'
    //       }
    //     // this.delay(3000, redirectUrl)
    //       this.router.navigate([redirectUrl])
    //     }
    //   )
    //
    //     }, err => {
    //       this.notificationService.error('Error', 'Incorrect or not activated email')
    //     })
    //   }
    // }, error => {
    // })

  }

//   delay(ms: number, redirectUrl: string) {
//     return new Promise( resolve => {
//       setTimeout(()=>{
//         this.router.navigate([redirectUrl])
//       }, ms)
//     } );
// }

  onLogin() {
    localStorage.removeItem('token')
    this.authService.login(this.form.value).subscribe(resp => {
        this.notificationService.success('Success', 'Login successful.')

      this.route.queryParamMap.subscribe(
        queryParams => {
          let redirectUrl = ""
          if (queryParams.has("redirect")){
            redirectUrl = "/pages/kibana"
          //   this.apiService.post("/api/auth/kibana/login",
          // '{"key":"'+ user.key + '"}').subscribe(async data => {
          //   })
          }else{
            redirectUrl = "/pages/send-logs"
          }
        // this.delay(3000, redirectUrl)
          this.router.navigate([redirectUrl]).then(() => {
  });
        }
      )


      // this.router.navigate(['/pages/dashboard'])

      // this.router.navigate(['/pages/dashboard'])
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
