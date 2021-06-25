import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../auth/authentication.service";
import {HighlightResult} from "ngx-highlightjs";
import {loadStripe} from "@stripe/stripe-js/pure";
import {IntegrationService} from "../../@core/service/integration.service";
import {NotificationsService} from "angular2-notifications";

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
  customerId = ''
  view: any[] = [400, 200];
  colorScheme = {
    domain: ['#00ff00', '#ff0000', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#ffffff';

  units: string = 'GBs';

  stripePromise = loadStripe(
    'pk_test_51ILUOvIf2Ur5sxpSWO3wEhlDoyIWLbsXHYlZWqAGYinErMW59auHgqli7ASHJ7Qp7XyRFZjrTEAWWUbRBm3qt4eb00ByhhRPPp');

  constructor(private router: Router, private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
      this.hasPaid = user.hasPaid
      this.availableData = user.availableData
      this.usedData = user.usedData
    })
    this.quantity = 1


    this.route.queryParams
      .subscribe(params => {
        if (params["payment"]=='successful'.concat(this.key)){
          this.paymentSuccessful = 'true'
        }else if (params["payment"]=='failed'.concat(this.key)){
          this.paymentSuccessful = 'false'
        }
        }
      );


  }



  plus() {
    this.quantity++;
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
      priceID: 'price_1J2tf6If2Ur5sxpSCxAVA2eW',
      cancelUrl: 'http://localhost:4200/pages/profile?payment=failed'.concat(this.key),
      successUrl: 'http://localhost:4200/pages/profile?payment=successful'.concat(this.key),
    };
    const stripe = await this.stripePromise;
    this.integrationService.subscription(payment).subscribe(data => {
      this.customerId = data.id;
      stripe.redirectToCheckout({
        sessionId: data.id
      })
    });
  }

  async stripeCLickCheckout() {
    const payment = {
      name: 'LogsightPayment',
      currency: 'eur',
      quantity: this.quantity,
      subscription: false,
      email: this.email,
      priceID: 'price_1J6LloIf2Ur5sxpSp9CvjWZr',
      cancelUrl: 'http://localhost:4200/pages/profile?payment=failed'.concat(this.key),
      successUrl: 'http://localhost:4200/pages/profile?payment=successful'.concat(this.key),
    };
    const stripe = await this.stripePromise;
    this.integrationService.subscription(payment).subscribe(data => {
      this.customerId = data.id;
      stripe.redirectToCheckout({
        sessionId: data.id
      })
    });
  }



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
