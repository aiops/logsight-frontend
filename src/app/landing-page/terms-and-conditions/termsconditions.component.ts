import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {timeout} from "rxjs/operators";

@Component({
  selector: 'terms-conditions',
  templateUrl: './termsconditions.component.html',
  styleUrls: ['../assets/css/style.css',
    '../assets/vendor/aos/aos.css', '../assets/vendor/remixicon/remixicon.css',
    '../assets/vendor/bootstrap-icons/bootstrap-icons.css',
    '../assets/vendor/swiper/swiper-bundle.min.css', '../assets/vendor/glightbox/css/glightbox.css'],
})
export class TermsconditionsComponent implements OnInit{

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

  ngAfterViewInit() {
   window.scrollTo(0, 0);
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

