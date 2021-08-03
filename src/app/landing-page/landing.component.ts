import { Component, OnDestroy, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { LoginService } from '../auth/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'landing',
  styleUrls: ['./assets/css/animate.css', './assets/css/owl.carousel.css', './assets/css/owl.theme.css',
    './assets/css/style.css', './landing.component.css'],
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit, AfterViewInit {

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

  onLogin() {
    this.authService.login(this.form.value).subscribe(resp => {
        this.router.navigate(['/pages/quickstart'])
      }, err => {
        console.log('login error', err)
        this.notificationService.error('Error', 'Incorrect email or password')
      }
    )
  }

  onSignUp() {
    localStorage.removeItem('token');
    this.authService.registerDemo(this.form.value).subscribe(resp => {
        this.notificationService.success('Success',
          'You are successfully registered. Please check your email to activate')
        this.router.navigate(['/auth/login'])
      }, err => {
        console.log('login error', err)
        this.notificationService.error('Error', 'User already exists, please sign in!')
      }
    )
  }

  redirectToLogin() {
    this.router.navigate(['/auth/login'])
  }
  redirectToImpressum() {
    this.router.navigate(['impressum'])
  }
  redirectToTermsAndConditions() {
    this.router.navigate(['terms-conditions'])
  }
  redirectToPrivacyAndPolicy() {
    this.router.navigate(['privacy-policy'])
  }

  ngAfterViewInit(): void {
    document.addEventListener("DOMContentLoaded", function(){
      // make it as accordion for smaller screens
      if (window.innerWidth < 992) {

        // close all inner dropdowns when parent is closed
        document.querySelectorAll('.navbar .dropdown').forEach(function(everydropdown){
          everydropdown.addEventListener('hidden.bs.dropdown', function () {
            // after dropdown is hidden, then find all submenus
            this.querySelectorAll('.submenu').forEach(function(everysubmenu){
              // hide every submenu as well
              everysubmenu.style.display = 'none';
            });
          })
        });

        document.querySelectorAll('.dropdown-menu a').forEach(function(element){
          element.addEventListener('click', function (e) {
            let nextEl = this.nextElementSibling;
            if(nextEl && nextEl.classList.contains('submenu')) {
              // prevent opening link if link needs to open dropdown
              e.preventDefault();
              if(nextEl.style.display == 'block'){
                nextEl.style.display = 'none';
              } else {
                nextEl.style.display = 'block';
              }

            }
          });
        })
      }
      // end if innerWidth
    });
  }
}

