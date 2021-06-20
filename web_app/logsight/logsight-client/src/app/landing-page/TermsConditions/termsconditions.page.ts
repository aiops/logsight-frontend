import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {timeout} from "rxjs/operators";

@Component({
  selector: 'terms-conditions',
  styleUrls: ['../assets/css/animate.css', '../assets/css/owl.carousel.css', '../assets/css/owl.theme.css', '../assets/css/style.css'],
  templateUrl: './termsconditions.page.html',
})
export class TermsconditionsPage implements OnInit{

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('demo')
  });
  message = '';

  constructor(private authService: LoginService,
              private notificationService: NotificationsService,
              private router: Router) {
  }

  ngOnInit(): void {
    //hack code to stop spinner
    const el = document.getElementById('nb-global-spinner');
    if (el) {
      el.style['display'] = 'none';
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 0) {
      let element = document.getElementById('navbar');
      element.classList.add('sticky');
    } else {
      let element = document.getElementById('navbar');
      element.classList.remove('sticky');
    }
  }


  redirectToLogin() {
    this.router.navigate(['/auth/login'])
  }
  redirectToHomepage() {
    this.router.navigate([''])
  }
  redirectToImpressum() {
    this.router.navigate(['impressum'])
  }
  redirectToPrivacyAndPolicy() {
    this.router.navigate(['privacy-policy'])
  }
}

