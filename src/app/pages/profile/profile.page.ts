import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../auth/authentication.service";
import {HighlightResult} from "ngx-highlightjs";
import {loadStripe} from "@stripe/stripe-js/pure";
import {IntegrationService} from "../../@core/service/integration.service";
import {NotificationsService} from "angular2-notifications";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {Browser} from "leaflet";
import win = Browser.win;

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
  form = new FormGroup({
  name: new FormControl('', Validators.required),
  });
  customerId = ''
  view: any[] = [400, 200];
  colorScheme = {
    domain: ['#00ff00', '#ff0000', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#ffffff';
  units: string = 'GBs';

  pKey: string = "";
  cancelUrl: string = "";
  successUrl: string = "";
  priceId: string = "";
  stripePromise;

  constructor(private router: Router, private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getUserData()
    this.quantity = 1

    if (window.location.href.toString().includes("demo")){
      this.pKey = environment.stripePkeyDemo
      this.cancelUrl = environment.stripeCancelUrlDemo
      this.successUrl = environment.stripeSuccessUrlDemo
      this.priceId = environment.stripePriceIdDemo
    }else {
      this.pKey = environment.stripePkey
      this.cancelUrl = environment.stripeCancelUrl
      this.successUrl = environment.stripeSuccessUrl
      this.priceId = environment.stripePriceId
    }

    this.stripePromise = loadStripe(
    this.pKey);

    this.route.queryParams
      .subscribe(params => {
        if (params["payment"]=='successful'.concat(this.key)){
          this.paymentSuccessful = 'true'
          this.getUserData()
        }else if (params["payment"]=='failed'.concat(this.key)){
          this.paymentSuccessful = 'false'
        }
        }
      );


  }

  getUserData(){
    const roundTo = function(num: number, places: number) {
      const factor = 10 ** places;
      return Math.round(num * factor) / factor;
        };

      this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
      this.hasPaid = user.hasPaid
      this.availableData = roundTo((user.availableData / 1000000), 1)
      this.usedData = roundTo((user.usedData / 1000000), 1)
    })
  }

  plus() {
    this.quantity++;
  }

  changeQuantity(){
    var quantity = this.form.controls['name'].value
    if (quantity >= 1){
      this.quantity = quantity
    }else{
      this.notificationService.error("The entry is not a valid number!")
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

  valueFormatter(val){
    return val.value
  }



}
