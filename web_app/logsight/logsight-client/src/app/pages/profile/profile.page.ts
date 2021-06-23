import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogsightUser } from '../../@core/common/logsight-user';
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

  key: string;
  email: string;
  quantity: number;
  hasPaid: Boolean;
  response: HighlightResult;
  customerId = ''
  stripePromise = loadStripe(
    'pk_test_51ILUOvIf2Ur5sxpSWO3wEhlDoyIWLbsXHYlZWqAGYinErMW59auHgqli7ASHJ7Qp7XyRFZjrTEAWWUbRBm3qt4eb00ByhhRPPp');

  constructor(private router: Router, private integrationService: IntegrationService, private authService: AuthenticationService,
              private notificationService: NotificationsService) {
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(user => {
      this.key = user.key
      this.email = user.email
      this.hasPaid = user.hasPaid
    })
    console.log(this.hasPaid)
    this.quantity = 1
  }


  plus() {
    this.quantity++;
  }

  minus() {
    if (this.quantity > 1) {
      this.quantity--;
    }

  }

  async stripeCLick() {
    const payment = {
      name: 'LogsightPayment',
      currency: 'eur',
      quantity: this.quantity,
      amount: 999,
      email: this.email,
      priceID: 'price_1J2tf6If2Ur5sxpSCxAVA2eW',
      cancelUrl: 'http://localhost:4200/pages/integration',
      successUrl: 'http://localhost:4200/pages/integration',
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



}
