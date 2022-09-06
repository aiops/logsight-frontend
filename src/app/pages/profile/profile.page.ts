import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../auth/authentication.service";
import {HighlightResult} from "ngx-highlightjs";
import {IntegrationService} from "../../@core/service/integration.service";
import {NotificationsService} from "angular2-notifications";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../auth/login.service";
import {ApiService} from "../../@core/service/api.service";
import {LogsightUser} from "../../@core/common/logsight-user";
import {loadStripe} from "@stripe/stripe-js/pure";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'profile', styleUrls: ['./profile.page.scss'], templateUrl: './profile.page.html',
})
export class ProfilePage implements OnInit {
  key: string;
  email: string;
  response: HighlightResult;
  isMatching = true;
  formPassword = new FormGroup({
    userId: new FormControl(''),
    oldPassword: new FormControl('', Validators.minLength(8)),
    newPassword: new FormControl('', Validators.minLength(8)),
    repeatNewPassword: new FormControl('', Validators.minLength(8))
  });
  id: string;

  form = new FormGroup({
    name: new FormControl('', Validators.pattern(`^[a-z0-9_-]*$`)),
  });
  view: any[] = [400, 200];
  colorScheme = {
    domain: ['#00ff00', '#ff0000', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  userId: string;
  user: LogsightUser | null;
  isSpinning = false;
  stripePromise = loadStripe(environment.stripePkId);

  constructor(private router: Router,
              private integrationService: IntegrationService,
              private authService: AuthenticationService,
              private notificationService: NotificationsService,
              private route: ActivatedRoute,
              private loginService: LoginService,
              private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.authService.getLoggedUser(this.userId).subscribe(resp => {
      this.email = resp.email
      this.id = resp.userId
      this.user = resp
    })

    this.route.queryParams.subscribe(params => {
      if (params.payment == 'false') {
        this.apiService.handleErrors({"error":"Payment failed", "message":"Please go to your customer payment portal, and check details."})
      }
    }, error => {
      this.apiService.handleErrors(error)
    })
  }

  async stripeCLick() {
    const payment = {
      currency: 'usd',
      email: this.email,
      priceID: environment.stripePriceId,
      cancelUrl: environment.stripeCancelUrl,
      successUrl: environment.stripeSuccessUrl,
    };
    const stripe = await this.stripePromise;
    this.integrationService.subscription(payment).subscribe(data => {
      console.log(data)
      if (data.isAlreadySubscribed) {
        stripe.redirectToCheckout({
          sessionId: data.sessionId
        })
      }
      else{
        this.notificationService.success("Already subscribed", "If you look to extend your limites over the Developer plan, please reach out support@logsight.ai", {
      timeOut: 10000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    })
      }
    });
  }
  async stripeCustomerPortal() {
    const stripe = await this.stripePromise;
    this.integrationService.checkCustomerPortal().subscribe(data => {
      window.open(data['stripeCustomerPortalUrl'], "_blank");
    });
  }

  changePassword() {
    this.formPassword.get("userId").setValue(this.id)
    let newPassword = this.formPassword.value.newPassword
    let newPasswordRetry = this.formPassword.value.repeatNewPassword
    if (newPassword != newPasswordRetry) {
      this.isMatching = false
    } else {
      this.isMatching = true
      this.loginService.changePassword(this.formPassword.value).subscribe(resp => {
        this.notificationService.success("Success", "The password was successfully updated.", this.apiService.getNotificationOpetions())
      }, error => {
        this.apiService.handleErrors(error)
      })
    }
  }


}
