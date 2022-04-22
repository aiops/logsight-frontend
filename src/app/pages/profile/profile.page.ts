import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../auth/authentication.service";
import {HighlightResult} from "ngx-highlightjs";
import {IntegrationService} from "../../@core/service/integration.service";
import {NotificationsService} from "angular2-notifications";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../auth/login.service";
import {ApiService} from "../../@core/service/api.service";
import {Application} from "../../@core/common/application";
import {LogsightUser} from "../../@core/common/logsight-user";

@Component({
  selector: 'profile',
  styleUrls: ['./profile.page.scss'],
  templateUrl: './profile.page.html',
})
export class ProfilePage implements OnInit {
  availableData: number;
  usedData: number;
  key: string;
  email: string;
  quantity: number;
  hasPaid: Boolean;
  response: HighlightResult;
  paymentSuccessful: string = 'default'
  isMatching = true;
  formPassword = new FormGroup({
    userId: new FormControl(''),
    oldPassword: new FormControl('', Validators.minLength(8)),
    newPassword: new FormControl('', Validators.minLength(8)),
    repeatNewPassword: new FormControl('', Validators.minLength(8))
  });
  id: string;

  form = new FormGroup({
    name: new FormControl('', Validators.pattern(`^[a-zA-Z0-9][ a-zA-Z0-9_.-]+$`)),
  });
  customerId = ''
  view: any[] = [400, 200];
  colorScheme = {
    domain: ['#00ff00', '#ff0000', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#ffffff';
  units: string = 'GBs';

  userId: string;

  pKey: string = "";
  cancelUrl: string = "";
  successUrl: string = "";
  priceId: string = "";
  stripePromise;

  user: LogsightUser | null
  applicationId: string;
  isSpinning = false;
  applications: Application[] = [];
  applicationName: string;


  constructor(private router: Router, private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService, private route: ActivatedRoute, private loginService: LoginService, private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.authService.getLoggedUser(this.userId).subscribe(resp => {
        this.email = resp.email
        this.id = resp.userId
        this.user = resp
      }
    )
    this.loadApplications(this.userId)
  }

  applicationSelected(appId: string) {
    this.applications.forEach(it => {
      if (appId == it.applicationId) {
        this.applicationName = it.name
      }
    })
    appId === null ? this.applicationId = null : this.applicationId = appId;
  }

  // getUserData(){
  //   const roundTo = function(num: number, places: number) {
  //     const factor = 10 ** places;
  //     return Math.round(num * factor) / factor;
  //       };
  //
  //     this.authService.getLoggedUser().subscribe(user => {
  //     this.email = user.email
  //       this.id = user.id
  //     // this.hasPaid = user.hasPaid
  //     // this.availableData = roundTo((user.availableData / 1000000), 1)
  //     // this.usedData = roundTo((user.usedData / 1000000), 1)
  //   })
  // }

  plus() {
    this.quantity++;
  }

  changeQuantity() {
    var quantity = this.form.controls['name'].value
    if (quantity >= 1) {
      this.quantity = quantity
    } else {
      this.notificationService.error("The entry is not a valid number!")
    }

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

  minus() {
    if (this.quantity > 1) {
      this.quantity--;
    }

  }


  async stripeCLickSubscription() {
    const payment = {
      name: 'LogsightPayment',
      currency: 'eur',
      quantity: this.quantity,
      subscription: true,
      email: this.email,
      priceID: this.priceId,
      cancelUrl: this.cancelUrl.concat(this.key),
      successUrl: this.successUrl.concat(this.key),
    };
    const stripe = await this.stripePromise;
    this.integrationService.subscription(payment).subscribe(data => {
      this.customerId = data.id;
      stripe.redirectToCheckout({
        sessionId: data.id
      })
    });
  }


  createApplication() {
    this.isSpinning = true
    if (this.form) {
      this.integrationService.createApplication(this.userId, {applicationName: this.form.get("name").value}).subscribe(
        resp => {
          setTimeout(_ => {
            this.applicationSelected(resp.applicationId);
          }, 50);
          this.loadApplications(this.userId);
          this.form.reset()
          this.isSpinning = false
          this.notificationService.success("Application created", "Application successfully created.", this.apiService.getNotificationOpetions())
        }, error => {
          this.apiService.handleErrors(error)
          this.isSpinning = false
        })
    }
  }

  removeApplication(id: string) {
    this.integrationService.deleteApplication(this.userId, id).subscribe(
      resp => {
        this.notificationService.success('Success', 'Application successfully deleted', this.apiService.getNotificationOpetions())
        this.loadApplications(this.userId)
      }, error => {
        this.apiService.handleErrors(error)
      })
  }

  loadApplications(userId: string) {
    this.integrationService.loadApplications(userId).subscribe(resp => {
      this.applications = resp.applications
    })
  }


  // async stripeCLickCheckout() {
  //   const payment = {
  //     name: 'LogsightPayment',
  //     currency: 'eur',
  //     quantity: this.quantity,
  //     subscription: false,
  //     email: this.email,
  //     priceID: 'price_1J6LloIf2Ur5sxpSp9CvjWZr',
  //     cancelUrl: 'https://demo.logsight.ai/pages/profile?payment=failed'.concat(this.key),
  //     successUrl: 'https://demo.logsight.ai/pages/profile?payment=successful'.concat(this.key),
  //   };
  //   const stripe = await this.stripePromise;
  //   this.integrationService.subscription(payment).subscribe(data => {
  //     this.customerId = data.id;
  //     stripe.redirectToCheckout({
  //       sessionId: data.id
  //     })
  //   });
  // }


  async stripeCustomerPortal() {
    const stripe = await this.stripePromise;
    this.integrationService.checkCustomerPortal().subscribe(data => {
      window.open(data['url'], "_blank");
    });
  }

  valueFormatter(val) {
    return val.value
  }


}
