import { Component, OnInit, HostListener } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['../assets/css/style.css',
    '../assets/vendor/aos/aos.css', '../assets/vendor/remixicon/remixicon.css',
    '../assets/vendor/bootstrap-icons/bootstrap-icons.css',
    '../assets/vendor/swiper/swiper-bundle.min.css', '../assets/vendor/glightbox/css/glightbox.css'],
})
export class PrivacyPolicyComponent implements OnInit{

  //DELETE EVERYTHING HERE IF NOT USED ON THE PAGE
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
  onLogin() {
    this.authService.login(this.form.value).subscribe(resp => {
        this.router.navigate(['/pages/quickstart'])
      }, err => {
        console.log('login error', err)
        this.notificationService.error('Error', 'Incorrect email or password')
      }
    )
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
  redirectToTermsAndConditions() {
    this.router.navigate(['terms-conditions'])
  }
}
